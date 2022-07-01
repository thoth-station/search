import { AdviseDocumentRequestResponseSuccess } from "../api";
import { components } from "lib/schema";
import { useMemo } from "react";

const findCVEPackages = (
    justifications: components["schemas"]["Justification"],
) => {
    const cves = new Map();
    justifications.forEach(just => {
        if (
            just.message.includes("CVE") &&
            !just.message.startsWith("No known")
        ) {
            const matches = Array.from(just.message.matchAll(/'(.*?)'/g));
            if (matches && matches.length === 4) {
                if (!cves.has(matches[3])) {
                    cves.set(matches[3][1], [
                        {
                            name: matches[0][1],
                            version: matches[1][1],
                            index: matches[2][1],
                        },
                    ]);
                } else {
                    cves.set(matches[3], [
                        ...cves.get(matches[3][1]),
                        {
                            name: matches[0][1],
                            version: matches[1][1],
                            index: matches[2][1],
                        },
                    ]);
                }
            }
        }
    });

    return cves;
};

const findPackagesWithWarnings = (
    justifications: components["schemas"]["Justification"],
) => {
    const pkgs = new Map<string, number>();
    justifications.forEach(just => {
        const package_justification = just as { package_name?: string };
        if (just.type === "WARNING" && package_justification?.package_name) {
            pkgs.set(
                package_justification.package_name,
                (pkgs.get(package_justification.package_name) ?? 0) + 1,
            );
        }
    });

    const sorted_array = Array.from(pkgs.entries()).sort(
        ([, a], [, b]) => a - b,
    );

    const top_bucket = sorted_array.at(-1)?.[1] ?? 0;

    return {
        values: sorted_array,
        top_packages: sorted_array.filter(([, count]) => count === top_bucket),
        avg:
            sorted_array.reduce((prev, [, cur]) => prev + cur, 0) /
            sorted_array.length,
    };
};

export const useImportantJustifications = (
    adviseDocument?: AdviseDocumentRequestResponseSuccess,
) => {
    return useMemo(() => {
        if (!adviseDocument) {
            return {};
        }

        const justifications =
            adviseDocument?.result.report?.products?.[0].justification ?? [];

        const cvePackages = findCVEPackages(justifications);
        const warningPackages = findPackagesWithWarnings(justifications);

        return {
            cvePackages: cvePackages,
            warningPackages: warningPackages,
        };
    }, [adviseDocument]);
};
