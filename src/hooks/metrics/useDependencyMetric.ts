import { useEffect, useState } from "react";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";

export type DependencyMetricType = {
    /** summary object of all roots aggregated */
    all: {
        /** number of dependencies directly related to root packages */
        direct?: number;
        /** number of dependencies directly or indirectly related to the direct packages*/
        indirect?: number;
        /** number of dependencies that have no dependents*/
        roots?: number;
    };
    /** an object of key (package name) value pairs of specific roots with direct and indirect parameters for each value */
    roots: {
        [key: string]: {
            /** roots own direct packages */
            direct?: number;
            /** roots own indirect packages */
            indirect?: number;
        };
    };
};

export const useDependencyMetric = (graph?: Graph<Node<PackageNodeValue>>) => {
    const [metric, setMetric] = useState<DependencyMetricType>();

    useEffect(() => {
        if (!graph) {
            return;
        }

        const base: DependencyMetricType = {
            all: {},
            roots: {},
        };

        const roots: string[] = [];
        graph.nodes.forEach(value => {
            if (value.value.depth === 0) {
                roots.push(value.key);
            }
        });

        const visited = new Set();

        // for each starting node
        roots.forEach(root => {
            const rootObj = graph.nodes.get(root);
            if (!rootObj) {
                return;
            }

            const bfs = graph.graphSearch(rootObj);
            const visitedOrder = Array.from(bfs);

            visitedOrder.forEach(node => {
                if (node.key === "*App") {
                    return;
                }

                if (visited.has(node.value.id)) {
                    return;
                } else {
                    visited.add(node.value.id);
                }

                const depth =
                    node.value.depth === 0
                        ? "roots"
                        : node.value.depth === 1
                        ? "direct"
                        : "indirect";

                base.all[depth] = (base.all[depth] ?? 0) + 1;

                if (depth !== "roots") {
                    if (!base.roots[root]) {
                        base.roots[root] = {};
                    }
                    base.roots[root][depth] =
                        (base.roots?.[root]?.[depth] ?? 0) + 1;
                }
            });
        });

        setMetric(base);
    }, [graph]);

    return metric;
};
