import { useEffect, useState } from "react";
import { MergedGraph } from "lib/interfaces/Graph";
import { components } from "lib/schema";

export type AdviseMetricType = {
    /** The number of new dependencies */
    added: number;
    /** The number of removed dependencies */
    removed: number;
    /** The number of dependencies whose version was changed*/
    version: number;
    /** The number of dependencies that did not change*/
    unchanged: number;
    /** The number Thoth justification (warnings) that were produced */
    justification: Record<string, number>;
    /** which build is being displayed (new or old) */
    build: string;
};

export const useAdviseMetric = (
    graph?: MergedGraph,
    adviseDocument?: components["schemas"]["AdviserResultResponse"],
) => {
    const [metric, setMetric] = useState<AdviseMetricType>();

    useEffect(() => {
        if (!graph || !adviseDocument?.metadata) {
            return;
        }

        const base: AdviseMetricType = {
            added: 0,
            removed: 0,
            version: 0,
            unchanged: 0,
            justification: {},
            build: "",
        };

        // package changes
        graph.nodes.forEach(node => {
            switch (node.value.change) {
                case "added":
                    base.added++;
                    break;
                case "removed":
                    base.removed++;
                    break;
                case "version":
                    base.version++;
                    break;
                default:
                    base.unchanged++;
            }
        });

        //build environment
        base.build = `We have analysed an application stack running on ${adviseDocument.metadata.os_release.name} ${adviseDocument.metadata.os_release.version}, running Python (${adviseDocument.metadata.python.implementation_name}) ${adviseDocument.metadata.python.major}.${adviseDocument.metadata.python.minor}.${adviseDocument.metadata.python.micro}. It was Adviser Job ID ${adviseDocument.metadata.document_id}, by ${adviseDocument.metadata.analyzer} v${adviseDocument.metadata.analyzer_version}.`;

        //justification counts
        adviseDocument?.result?.report?.products?.[0]?.justification.forEach(
            justification => {
                if (base.justification[justification.type]) {
                    base.justification[justification.type] =
                        base.justification[justification.type] + 1;
                } else {
                    base.justification[justification.type] = 1;
                }
            },
        );
        setMetric(base);
    }, [graph, adviseDocument]);

    return metric;
};
