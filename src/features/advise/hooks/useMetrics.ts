import { useMemo } from "react";
import {
  useLicenseMetric,
  useDependencyMetric,
  useAdviseMetric,
  DependencyMetricType,
  LicenseMetricType,
  AdviseMetricType,
} from "hooks/metrics";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";
import { AdviseDocumentRequestResponseSuccess } from "../api";

export type AllMetrics = {
  advise: AdviseMetricType | null;
  dependencies: DependencyMetricType | null;
  licenses: LicenseMetricType | null;
};

export function useMetrics(
  graph?: Graph<Node<PackageNodeValue>>,
  adviseDocument?: AdviseDocumentRequestResponseSuccess,
) {
  const adviseMetric = useAdviseMetric(graph, adviseDocument);
  const dependencyMetric = useDependencyMetric(graph);
  const licenseMetric = useLicenseMetric(graph);

  return useMemo(() => {
    const base: AllMetrics = {
      advise: null,
      dependencies: null,
      licenses: null,
    };

    if (adviseMetric) {
      base.advise = adviseMetric;
    }
    if (dependencyMetric) {
      base.dependencies = dependencyMetric;
    }
    if (licenseMetric) {
      base.licenses = licenseMetric;
    }

    return base;
  }, [adviseMetric, dependencyMetric, licenseMetric]);
}
