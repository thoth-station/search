import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { Graph, MergedGraph } from "lib/interfaces/Graph";
import { discoverPackageChanges } from "../utils";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";
import { PackageMergedNodeValue } from "../../../lib/interfaces/PackageMergedNodeValue";
import { AdviseDocumentRequestResponseSuccess } from "../api";

export const useMergeGraphs = (
    oldGraph?: Graph<Node<PackageNodeValue>>,
    newGraph?: Graph<Node<PackageNodeValue>>,
    adviseDocument?: AdviseDocumentRequestResponseSuccess,
) => {
    const [graph, setGraph] = useState<MergedGraph>();
    const theme = useTheme();

    useEffect(() => {
        if (!oldGraph || !newGraph) {
            return;
        }

        const mergedGraph = new Graph<
            Node<PackageMergedNodeValue>
        >() as MergedGraph;

        newGraph.nodes.forEach((value, key) => {
            // get node
            const combinedNode = newGraph.nodes.get(key);
            if (!combinedNode) {
                return;
            }

            // check if added, changed, or unchanged
            // if added (old graph doesnt have the package)
            if (!oldGraph.nodes.has(key)) {
                combinedNode.value = {
                    ...combinedNode.value,
                    change: "added",
                    font: {
                        color: theme.palette.success.main,
                    },
                    color: theme.palette.success.main,
                    dependencies: value.adjacents.size,
                    lockfile: ["new"],
                };
            }
            // if the graph is not new then it is either equal or the version changed
            else {
                // set values that wont change
                combinedNode.value = {
                    ...combinedNode.value,
                    dependencies: value.adjacents.size,
                    lockfile: ["new", "old"],
                };
                // if the nodes are equal (version are the same)
                if (
                    value?.value?.metadata?.Version ===
                    oldGraph.nodes.get(key)?.value?.metadata?.Version
                ) {
                    combinedNode.value = {
                        ...combinedNode.value,
                        change: "unchanged",
                    };
                }
                // if the version changed
                else {
                    combinedNode.value = {
                        ...combinedNode.value,
                        change: "version",
                        oldVersion:
                            oldGraph.nodes.get(key)?.value?.metadata?.Version ??
                            oldGraph.nodes.get(key)?.value?.version,
                        font: {
                            color: theme.palette.success.main,
                        },
                    };

                    combinedNode.parents = new Set([
                        ...combinedNode.parents,
                        ...(oldGraph.nodes.get(key)?.parents ?? []),
                    ]);

                    const adjMap = new Map();
                    combinedNode.adjacents.forEach(value => {
                        adjMap.set(value.key, value);
                    });

                    oldGraph.nodes.get(key)?.adjacents.forEach(value => {
                        if (!adjMap.has(value.key)) {
                            adjMap.set(value.key, value);
                        }
                    });

                    combinedNode.adjacents = new Set(adjMap.values());
                }
            }

            mergedGraph.nodes.set(
                key,
                combinedNode as Node<PackageMergedNodeValue>,
            );
        });

        oldGraph.nodes.forEach((value, key) => {
            // get node
            const combinedNode = oldGraph.nodes.get(key);
            if (!combinedNode) {
                return;
            }

            // only checking if package was removed
            if (!newGraph.nodes.has(key)) {
                combinedNode.value = {
                    ...combinedNode.value,
                    change: "removed",
                    label:
                        value.value.label +
                        " " +
                        (value?.value?.metadata?.Version ??
                            value?.value?.version),
                    font: {
                        color: theme.palette.error.main,
                    },
                    color: theme.palette.error.main,
                    version:
                        value?.value?.metadata?.Version ??
                        value?.value?.version,
                    dependencies: value.adjacents.size,
                    license: value?.value?.metadata?.License ?? "",
                    lockfile: ["old"],
                };

                mergedGraph.nodes.set(
                    key,
                    combinedNode as Node<PackageMergedNodeValue>,
                );
            }
        });

        const visGraphEdges = new Map();

        // add edges from old graph
        oldGraph.nodes.forEach(value => {
            // set package edges
            value.adjacents.forEach(adj => {
                visGraphEdges.set(value.value.id + adj.value.id, {
                    id: value.value.id + adj.value.id,
                    to: value.value.id,
                    from: adj.value.id,
                });
            });
        });

        // add edges from new graph
        newGraph.nodes.forEach(value => {
            // set package edges
            value.adjacents.forEach(adj => {
                visGraphEdges.set(value.value.id + adj.value.id, {
                    id: value.value.id + adj.value.id,
                    to: value.value.id,
                    from: adj.value.id,
                });
            });
        });

        // set justifications
        discoverPackageChanges(
            Array.from(mergedGraph.nodes.values()),
            adviseDocument?.result?.report?.products?.[0]?.justification,
        );

        // add edges to merged graph Object
        mergedGraph["visEdges"] = Array.from(visGraphEdges.values());

        setGraph(mergedGraph);
    }, [oldGraph, newGraph, adviseDocument, theme]);

    return graph;
};
