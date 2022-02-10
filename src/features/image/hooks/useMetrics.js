import { useMemo } from "react";
import { useLicenseMetric, useDependencyMetric } from "hooks/metrics";

export function useMetrics(graph) {
    const dependencyMetric = useDependencyMetric(graph);
    const licenseMetric = useLicenseMetric(graph);

    return useMemo(() => {
        const base = {
            dependencies: null,
            licenses: null,
        };

        if (dependencyMetric) {
            base.dependencies = dependencyMetric;
        }
        if (licenseMetric) {
            base.licenses = licenseMetric;
        }

        return base;
    }, [dependencyMetric, licenseMetric]);
}
