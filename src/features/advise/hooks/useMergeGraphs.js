import { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { Graph } from "utils/Graph";
import { discoverPackageChanges } from "../utils";

export const useMergeGraphs = (oldGraph, newGraph, adviseDocument) => {
    const [graph, setGraph] = useState();
    const theme = useTheme();

    useEffect(() => {
        if (!oldGraph || !newGraph) {
            return;
        }

        const visGraphEdges = [];
        const mergedGraph = new Graph();

        newGraph.nodes.forEach((value, key) => {
            // get node
            const combinedNode = newGraph.nodes.get(key);

            // check if added, changed, or unchanged
            // if added (old graph doesnt have the package)
            if (!oldGraph.nodes.has(key)) {
                combinedNode.value = {
                    ...combinedNode.value,
                    change: "added",
                    label:
                        value.value.label +
                        " " +
                        (value?.value?.metadata?.Version ?? ""),
                    font: {
                        color: theme.palette.success.main,
                    },
                    color: theme.palette.success.main,
                    version: value?.value?.metadata?.Version ?? "",
                    dependencies: value.adjacents.size,
                    license: value?.value?.metadata?.License ?? "",
                    lockfile: ["new"],
                };
            }
            // if the graph is not new then it is either equal or the version changed
            else {
                // set values that wont change
                combinedNode.value = {
                    ...combinedNode.value,
                    label:
                        value.value.label +
                        " " +
                        (value?.value?.metadata?.Version ?? ""),
                    dependencies: value.adjacents.size,
                    license: value?.value?.metadata?.License ?? "",
                    lockfile: ["new", "old"],
                };
                // if the nodes are equal (version are the same)
                if (
                    value?.value?.metadata?.Version ===
                    oldGraph.nodes.get(key)?.value?.metadata?.Version
                ) {
                    combinedNode.value = {
                        ...combinedNode.value,
                        version: value?.value?.metadata?.Version ?? "",
                        change: "unchanged",
                    };
                }
                // if the version changed
                else {
                    combinedNode.value = {
                        ...combinedNode.value,
                        change: "version",
                        version: value?.value?.metadata?.Version ?? "",
                        oldVersion:
                            oldGraph.nodes.get(key)?.value?.metadata?.Version ??
                            "",
                        font: {
                            color: theme.palette.success.main,
                        },
                    };

                    combinedNode.parents = [
                        ...new Set([
                            ...combinedNode.parents,
                            ...(oldGraph.nodes.get(key)?.parents ?? []),
                        ]),
                    ];

                    // merge the dependencies because they could be different
                    oldGraph.nodes
                        .get(key)
                        .getAdjacents()
                        .forEach(item => combinedNode.adjacents.add(item));
                    newGraph.nodes
                        .get(key)
                        .getAdjacents()
                        .forEach(item => combinedNode.adjacents.add(item));
                }
            }

            mergedGraph.nodes.set(key, combinedNode);
        });

        oldGraph.nodes.forEach((value, key) => {
            // get node
            const combinedNode = oldGraph.nodes.get(key);

            // only checking if package was removed
            if (!newGraph.nodes.has(key)) {
                combinedNode.value = {
                    ...combinedNode.value,
                    change: "removed",
                    label:
                        value.value.label +
                        " " +
                        (value?.value?.metadata?.Version ?? ""),
                    font: {
                        color: theme.palette.error.main,
                    },
                    color: theme.palette.error.main,
                    version: value?.value?.metadata?.Version ?? "",
                    dependencies: value.adjacents.size,
                    license: value?.value?.metadata?.License ?? "",
                    lockfile: ["old"],
                };

                mergedGraph.nodes.set(key, combinedNode);
            }
        });

        // add edges from old graph
        oldGraph.nodes.forEach(value => {
            // set package edges
            value.adjacents.forEach(adj => {
                visGraphEdges.push({
                    to: value.value.id,
                    from: adj.value.id,
                    lockfile: "old",
                });
            });
        });

        // add edges from new graph
        newGraph.nodes.forEach(value => {
            // set package edges
            value.adjacents.forEach(adj => {
                visGraphEdges.push({
                    to: value.value.id,
                    from: adj.value.id,
                    lockfile: "new",
                });
            });
        });

        // set justifications
        discoverPackageChanges(
            mergedGraph.nodes,
            adviseDocument?.result?.report?.products?.[0]?.justification,
        );

        // add edges to merged graph Object
        mergedGraph["visEdges"] = visGraphEdges;

        setGraph(mergedGraph);
    }, [oldGraph, newGraph, adviseDocument, theme]);

    return graph;
};
