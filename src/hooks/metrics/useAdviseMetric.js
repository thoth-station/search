import { useEffect, useState } from "react";

export const useAdviseMetric = (graph, adviseDocument) => {
    const [metric, setMetric] = useState();

    useEffect(() => {
        if (!graph || !adviseDocument) {
            return;
        }

        const base = {
            added: 0,
            removed: 0,
            version: 0,
            unchanged: 0,
            justification: {},
            build: null,
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
                base.justification[justification.type] = base.justification[
                    justification.type
                ]
                    ? base.justification[justification.type] + 1
                    : 1;
            },
        );
        setMetric(base);
    }, [graph, adviseDocument]);

    return metric;
};
