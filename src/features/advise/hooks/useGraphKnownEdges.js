import { useMemo, useEffect, useState } from "react";

// utils
import { Graph } from "utils/Graph";

// api
import { usePackagesMetadata } from "api";

export function useGraphKnownEdges(data, dependency_graph) {
    const allMetadata = usePackagesMetadata(data);

    const allMetadataStatus = useMemo(() => {
        const status = {
            loading: false,
            error: false,
            success: false,
        };
        if (allMetadata.length > 0) {
            allMetadata.forEach(query => {
                switch (query.status) {
                    case "error":
                        status.error = true;
                        break;
                    case "success":
                        status.success = true;
                        break;
                    default:
                        status.loading = true;
                }
            });
        } else {
            return "loading";
        }

        if (status.loading) {
            return "loading";
        } else if (status.error) {
            return "error";
        } else {
            return "success";
        }
    }, [allMetadata]);

    const [graph, setGraph] = useState();

    useEffect(() => {
        if (allMetadataStatus === "loading") {
            // handle error
            return;
        }

        // create graph
        const tempGraph = new Graph();

        // merge data together
        allMetadata.forEach(query => {
            let value;
            if (query.status === "error") {
                const params = query.error.response.data.parameters;
                value = {
                    id: params.name.toLowerCase(),
                    label: params.name,
                    metadata: null,
                };
            } else {
                const metadata = query.data.data.metadata;
                value = {
                    id: metadata.package_name.toLowerCase(),
                    label: metadata.package_name,
                    metadata: metadata.importlib_metadata.metadata,
                };
            }

            // add package to graph
            const node = tempGraph.addVertex(value.id, value);
            node.parents = new Set();
        });

        const app = tempGraph.addVertex("*App", {
            id: "*App",
            label: "App",
            depth: -1,
        });

        const roots = new Set([...Array(dependency_graph.nodes.length).keys()]);

        dependency_graph.edges.forEach(edge => {
            roots.delete(edge[1]);

            const toNode = tempGraph.nodes.get(
                dependency_graph.nodes[edge[1]].toLowerCase(),
            );
            const fromNode = tempGraph.nodes.get(
                dependency_graph.nodes[edge[0]].toLowerCase(),
            );

            // add edge connecting parent and dependency
            tempGraph.addEdge(fromNode.key, toNode.key);
            // set parent
            toNode.parents.add(fromNode.key);
        });

        const visited = new Set();
        const visitList = [];

        roots.forEach(root => {
            const toNode = tempGraph.nodes.get(
                dependency_graph.nodes[root].toLowerCase(),
            );

            visitList.push(toNode);
            toNode.value.depth = 0;

            // add edge connecting parent and dependency
            tempGraph.addEdge(app.key, toNode.key);
            // set parent
            toNode.parents.add(app.key);
        });

        // set depth using dfs
        while (visitList.length !== 0) {
            const node = visitList.pop();
            if (node && !visited.has(node)) {
                visited.add(node);

                const adjs = node.getAdjacents();

                for (let i = 0; i < adjs.length; i++) {
                    // update depth
                    adjs[i].value.depth = Math.min(
                        node.value.depth + 1,
                        adjs[i].value.depth ?? node.value.depth + 2,
                    );
                    visitList.push(adjs[i]);
                }
            }
        }

        setGraph(tempGraph);
    }, [allMetadataStatus]);

    return graph;
}
