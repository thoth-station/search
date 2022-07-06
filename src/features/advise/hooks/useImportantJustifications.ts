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

  return cves;
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
    values: sorted_array,
    top_packages: sorted_array.filter(([, count]) => count === top_bucket),
    avg: sorted_array.reduce((prev, [, cur]) => prev + cur, 0) / sorted_array.length,
  };
};

export const useImportantJustifications = (adviseDocument?: AdviseDocumentRequestResponseSuccess) => {
  const [result, setResult] = useState<{
    cvePackages?: Map<
      string,
      {
        packages: { name: string; version: string; index: string }[];
        report?: OpenSourceVulnerabilityFormat;
      }
    >;
    warningPackages?: {
      values: [string, number][];
      top_packages: [string, number][];
      avg: number;
    };
  }>();

  useEffect(() => {
    let active = true;
    load();
    return () => {
      active = false;
    };

    async function load() {
      if (adviseDocument) {
        const justifications = adviseDocument?.result.report?.products?.[0].justification ?? [];

        const cvePackages = await findCVEPackages(justifications);
        const warningPackages = findPackagesWithWarnings(justifications);

        setResult({
          cvePackages: cvePackages,
          warningPackages: warningPackages,
        });
      }
    }
  }, [adviseDocument?.result.report?.products?.[0].justification]);

  return result;
};
