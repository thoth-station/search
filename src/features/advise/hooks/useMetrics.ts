import { useMemo } from "react";
import {
    useLicenseMetric,
    useDependencyMetric,
    useAdviseMetric,
    DependencyMetricType,
    LicenseMetricType,
    AdviseMetricType,
} from "hooks/metrics";
import { Graph, MergedGraph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";
import { AdviseDocumentRequestResponseSuccess } from "../api";

export type AllMetrics = {
    advise: AdviseMetricType | null;
    oldGraph: {
        dependencies: DependencyMetricType | null;
        licenses: LicenseMetricType | null;
    };
    newGraph: {
        dependencies: DependencyMetricType | null;
        licenses: LicenseMetricType | null;
    };
};

export function useMetrics(
    oldGraph?: Graph<Node<PackageNodeValue>>,
    newGraph?: Graph<Node<PackageNodeValue>>,
    mergedGraph?: MergedGraph,
    adviseDocument?: AdviseDocumentRequestResponseSuccess,
) {
    const adviseMetric = useAdviseMetric(mergedGraph, adviseDocument);
    const oldDependencyMetric = useDependencyMetric(oldGraph);
    const newDependencyMetric = useDependencyMetric(newGraph);
    const oldLicenseMetric = useLicenseMetric(oldGraph);
    const newLicenseMetric = useLicenseMetric(newGraph);

    return useMemo(() => {
        const base: AllMetrics = {
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
        if (oldLicenseMetric) {
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
