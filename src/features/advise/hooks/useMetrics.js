import { useMemo } from "react";
import {
    useLicenseMetric,
    useDependencyMetric,
    useAdviseMetric,
} from "hooks/metrics";

export function useMetrics(oldGraph, newGraph, mergedGraph, adviseDocument) {
    const adviseMetric = useAdviseMetric(mergedGraph, adviseDocument);
    const oldDependencyMetric = useDependencyMetric(oldGraph);
    const newDependencyMetric = useDependencyMetric(newGraph);
    const oldLicenseMetric = useLicenseMetric(oldGraph);
    const newLicenseMetric = useLicenseMetric(newGraph);

    return useMemo(() => {
        const base = {
            advise: null,
            oldGraph: { dependencies: null, licenses: null },
            newGraph: { dependencies: null, licenses: null },
        };

        if (adviseMetric) {
            base.advise = adviseMetric;
        }
        if (oldDependencyMetric) {
            base.oldGraph.dependencies = oldDependencyMetric;
        }
        if (oldDependencyMetric) {
            base.oldGraph.licenses = oldLicenseMetric;
        }
        if (newDependencyMetric) {
            base.newGraph.dependencies = newDependencyMetric;
        }
        if (newLicenseMetric) {
            base.newGraph.licenses = newLicenseMetric;
        }

        return base;
    }, [
        adviseMetric,
        oldDependencyMetric,
        oldLicenseMetric,
        newDependencyMetric,
        newLicenseMetric,
    ]);
}
