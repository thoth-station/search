import { useMemo, useEffect, useState } from "react";

// utils
import { Graph } from "utils/Graph";

// api
import { usePackagesMetadata } from "features/misc/api";

/**
 * Given a list of packages, create a graph using metadata information.
 */
export function useGraph(data, knownRoots) {
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
            return;
        }

        // create graph
        const tempGraph = new Graph();
        const notRoot = [];

        // add data to graph
        allMetadata.forEach(query => {
            // if could not find metadata
            if (query.status === "error") {
                const params = query.error.response.data.parameters;
                const value = {
                    id: params.name.toLowerCase(),
                    label: params.name,
                    metadata: null,
                };

                // add package to graph
                const node = tempGraph.addVertex(value.id, value);
                node.parents = new Set();
            }
            // metadata was found
            else {
                const metadata = query.data.data.metadata;
                const value = {
                    id: metadata.package_name.toLowerCase(),
                    label: metadata.package_name,
                    metadata: metadata.importlib_metadata.metadata,
                };

                // add package to graph
                const node = tempGraph.addVertex(value.id, value);
                node.parents = new Set();
            }
        });

        // set edges
        allMetadata.forEach(query => {
            if (query.status === "error") {
                return;
            }

            const currentNode = tempGraph.nodes.get(
                query.data.data.metadata.package_name.toLowerCase(),
            );

            Object.keys(query.data.data.metadata.dependencies).forEach(dep => {
                const adjacentNode = tempGraph.nodes.get(dep);

                // if package exists in lockfile
                if (adjacentNode) {
                    // add edge connecting parent and dependency
                    tempGraph.addEdge(
                        currentNode.value.id,
                        adjacentNode.value.id,
                    );
                    // set parent
                    adjacentNode.parents.add(currentNode.value.id);
                    notRoot.push(adjacentNode.value.id);
                }
            });
        });

        // add app node to graph
        const app = tempGraph.addVertex("*App", {
            id: "*App",
            label: "App",
            depth: -1,
        });

        notRoot.push("*App");

        const visited = new Map();
        const visitList = [];

        // get roots and connect to app
        tempGraph.nodes.forEach((value, key, map) => {
            if (
                !notRoot.includes(key) ||
                Object.keys(knownRoots).includes(key)
            ) {
                const node = map.get(key);
                node.value.depth = 0;
                node.parents.add("*App");
                visitList.push(node);
                tempGraph.addEdge(app.key, node.key);
            }
        });

        // set depth and parent packages using dfs
        while (visitList.length !== 0) {
            const node = visitList.pop();
            if (node && !visited.has(node)) {
                visited.set(node);

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
    }, [allMetadataStatus, knownRoots]);

    return graph;
}
