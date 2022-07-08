import { useEffect, useState } from "react";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { components } from "lib/schema";
import { PackageNodeValue } from "../../lib/interfaces/PackageNodeValue";

export type AdviseMetricType = {
  justification: Record<string, number>;
  /** which build is being displayed (new or old) */
  build: string;
};

export const useAdviseMetric = (
  graph?: Graph<Node<PackageNodeValue>>,
  adviseDocument?: components["schemas"]["AdviserResultResponse"],
) => {
  const [metric, setMetric] = useState<AdviseMetricType>();

  useEffect(() => {
    if (!graph || !adviseDocument?.metadata) {
      return;
    }

    const base: AdviseMetricType = {
      justification: {},
      build: "",
    };

    //build environment
    base.build = `We have analysed an application stack running on ${adviseDocument.metadata.os_release.name} ${adviseDocument.metadata.os_release.version}, running Python (${adviseDocument.metadata.python.implementation_name}) ${adviseDocument.metadata.python.major}.${adviseDocument.metadata.python.minor}.${adviseDocument.metadata.python.micro}. It was Adviser Job ID ${adviseDocument.metadata.document_id}, by ${adviseDocument.metadata.analyzer} v${adviseDocument.metadata.analyzer_version}.`;

    //justification counts
    adviseDocument?.result?.report?.products?.[0]?.justification.forEach(justification => {
      if (base.justification[justification.type]) {
        base.justification[justification.type] = base.justification[justification.type] + 1;
      } else {
        base.justification[justification.type] = 1;
      }
    });
    setMetric(base);
  }, [graph, adviseDocument]);

  return metric;
};
