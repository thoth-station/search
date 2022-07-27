import { AdviseDocumentRequestResponseSuccess } from "../api";
import { components } from "lib/schema";
import { useEffect, useState } from "react";
import { getYamlFile } from "../../../api";

export type OpenSourceVulnerabilityFormat = {
  id: string;
  published: string;
  details: string;
  affected: {
    package: {
      ecosystem: string;
      name: string;
    };
    ranges: {
      type: string;
      repo?: string;
      events: {
        introduced?: string;
        fixed?: string;
      }[];
    }[];
    ecosystem_specific?: {
      severity?: string;
    };
  }[];
  references: {
    type: string;
    url: string;
  }[];
};

const findCVEPackages = async (justifications: components["schemas"]["Justification"]) => {
  const cves = new Map<
    string,
    {
      packages: { name: string; version: string; index: string }[];
      report?: OpenSourceVulnerabilityFormat;
    }
  >();

  await Promise.all(
    justifications.map(async just => {
      if (just.message.includes("CVE") && !just.message.startsWith("No known")) {
        const matches = Array.from(just.message.matchAll(/'(.*?)'/g));
        if (matches && matches.length === 4) {
          if (!cves.has(matches[3][1])) {
            const report = await getYamlFile(
              `https://raw.githubusercontent.com/pypa/advisory-database/main/vulns/${matches[0][1]}/${matches[3][1]}.yaml`,
            );
            cves.set(matches[3][1], {
              report: report,
              packages: [
                {
                  name: matches[0][1],
                  version: matches[1][1],
                  index: matches[2][1],
                },
              ],
            });
          } else {
            cves.set(matches[3][1], {
              ...(cves.get(matches[3][1]) ?? {}),
              packages: [
                ...(cves.get(matches[3][1])?.packages ?? []),
                {
                  name: matches[0][1],
                  version: matches[1][1],
                  index: matches[2][1],
                },
              ],
            });
          }
        }
      }
    }),
  );

  return { data: cves };
};

const findPackagesWithWarnings = (justifications: components["schemas"]["Justification"]) => {
  const pkgs = new Map<string, number>();
  justifications.forEach(just => {
    const package_justification = just as { package_name?: string };
    if (just.type === "WARNING" && package_justification?.package_name) {
      pkgs.set(package_justification.package_name, (pkgs.get(package_justification.package_name) ?? 0) + 1);
    }
  });

  const sorted_array = Array.from(pkgs.entries()).sort(([, a], [, b]) => a - b);

  const top_bucket = sorted_array.at(-1)?.[1] ?? 0;

  return {
    data: {
      values: sorted_array,
      top_packages: sorted_array.filter(([, count]) => count === top_bucket),
      avg: sorted_array.reduce((prev, [, cur]) => prev + cur, 0) / sorted_array.length,
    },
  };
};

const findUnmaintainedPackages = (justifications: components["schemas"]["Justification"]) => {
  const pkgs = new Map<
    string,
    {
      not_maintained?: boolean;
      last_release?: string;
      low_maintainers?: boolean;
    }
  >();
  const visited = new Set();
  justifications.forEach(just => {
    const package_name = (just as { package_name?: string }).package_name;
    if (package_name) {
      visited.add(package_name);
    }

    if (package_name && just.message.includes("actively maintained") && just.type === "WARNING") {
      pkgs.set(package_name, { ...pkgs.get(package_name), not_maintained: true });
    }

    if (package_name && just.message.includes("has no recent release")) {
      const date = just.message.split("dates back to ").at(-1);
      pkgs.set(package_name, { ...pkgs.get(package_name), last_release: date });
    }

    if (package_name && just.message.includes("low number of maintainers")) {
      pkgs.set(package_name, { ...pkgs.get(package_name), low_maintainers: true });
    }
  });

  return {
    data: {
      total: visited.size,
      packages: Array.from(pkgs.entries())
        .map(([k, v]) => ({
          ...v,
          id: k,
        }))
        .sort(
          (a, b) => new Date(b.last_release ?? Date.now()).getTime() - new Date(a.last_release ?? Date.now()).getTime(),
        ),
    },
  };
};

export const useImportantJustifications = (adviseDocument?: AdviseDocumentRequestResponseSuccess) => {
  const [result, setResult] = useState<{
    cvePackages?: {
      data?: Map<
        string,
        {
          packages: { name: string; version: string; index: string }[];
          report?: OpenSourceVulnerabilityFormat;
        }
      >;
    };
    warningPackages?: {
      data?: {
        values: [string, number][];
        top_packages: [string, number][];
        avg: number;
      };
    };
    unmaintainedPackages?: {
      data?: {
        total: number;
        packages: { id: string; not_maintained?: boolean; last_release?: string; low_maintainers?: boolean }[];
      };
    };
  }>();

  useEffect(() => {
    let active = true;
    load();
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      active = false;
    };

    async function load() {
      if (adviseDocument) {
        const justifications = adviseDocument?.result.report?.products?.[0].justification;

        if (!justifications) {
          setResult({
            cvePackages: {},
            warningPackages: {},
            unmaintainedPackages: {},
          });
          return;
        }

        const cvePackages = await findCVEPackages(justifications);
        const warningPackages = findPackagesWithWarnings(justifications);
        const unmaintainedPackages = findUnmaintainedPackages(justifications);

        setResult({
          cvePackages: cvePackages,
          warningPackages: warningPackages,
          unmaintainedPackages: unmaintainedPackages,
        });
      }
    }
  }, [adviseDocument?.result.report?.products?.[0].justification]);

  return result;
};
