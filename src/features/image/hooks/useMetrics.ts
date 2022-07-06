import { useMemo } from "react";
import { useLicenseMetric, useDependencyMetric, DependencyMetricType, LicenseMetricType } from "hooks/metrics";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";

export type ImageMetrics = {
  dependencies: DependencyMetricType | null;
  licenses: LicenseMetricType | null;
};

export function useMetrics(graph?: Graph<Node<PackageNodeValue>>) {
  const dependencyMetric = useDependencyMetric(graph);
  const licenseMetric = useLicenseMetric(graph);

  return useMemo(() => {
    const base: ImageMetrics = {
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
