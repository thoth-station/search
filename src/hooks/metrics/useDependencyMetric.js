import { useEffect, useState } from "react";

export const useDependencyMetric = graph => {
    const [metric, setMetric] = useState();

    useEffect(() => {
        if (!graph) {
            return;
        }

        let base = {
            all: {},
            roots: {},
        };

        const roots = [];
        graph.nodes.forEach(value => {
            if (value.value.depth === 0) {
                roots.push(value.key);
            }
        });

        const visited = new Set();

        // for each starting node
        roots.forEach(root => {
            const bfs = graph.graphSearch(graph.nodes.get(root));
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

                // dependency metric
                base = {
                    all: {
                        ...base.all,
                        [depth]: (base.all[depth] ?? 0) + 1,
                    },
                    roots: {
                        ...base.roots,
                        [root]: {
                            ...(base.roots[root] ?? null),
                            [depth]: (base.roots?.[root]?.[depth] ?? 0) + 1,
                        },
                    },
                };
            });
        });

        setMetric(base);
    }, [graph]);

    return metric;
};