import {useMemo, useEffect, useState} from "react";

// utils
import { Graph } from "utils/Graph";

// api
import {usePackagesDependencies} from "../api";
import {usePackagesMetadata} from "features/misc/api";

export function useGraph(data, knownRoots) {
    const allMetadata = usePackagesMetadata(data);
    const allDependencies = usePackagesDependencies(data);

    const allMetadataStatus = useMemo(() => {
        const status = {
            loading: false,
            error: false,
            success: false
        }
        if(allMetadata.length > 0) {
            allMetadata.forEach(query => {
                switch (query.status) {
                    case "error":
                        status.error = true
                        break;
                    case "success":
                        status.success = true
                        break;
                    default:
                        status.loading = true;
                }
            })
        }
        else {
            return "loading"
        }

       if(status.error) {
           return "error"
       }
       else if(status.loading) {
           return "loading"
       }
       else {
           return "success"
       }

    }, [allMetadata])

    const allDependenciesStatus = useMemo(() => {
        let isLoading = false;

        if(allDependencies.length > 0) {
            allDependencies.forEach(query => {
                if(query.status === "loading") {
                    isLoading = true
                }
            })
        }
        else {
            return "loading"
        }

        return isLoading ? "loading" : "success";

    }, [allDependencies])

    const [graph, setGraph] = useState();

    useEffect(() => {
        if(allMetadataStatus === "error") {
            // handle error
            return;
        }
        else if (allDependenciesStatus === "loading" || allMetadataStatus === "loading") {
            // not done loading
            return;
        }

        // create graph
        const tempGraph = new Graph();

        // create dependencies object
        const reformattedDeps = new Map();
         allDependencies.forEach(query => {
            if(query.isSuccess) {
                reformattedDeps.set(query.data.data.parameters.name, query.data.data.dependencies)
            }
        })

        // merge data together
        allMetadata.forEach(query => {
            const metadata = query.data.data.metadata ?? query.data.data.info;

            const value = {
                id: metadata.name.toLowerCase().replace(".", "-"),
                label: metadata.name,
                metadata: metadata
            };

            // add package to graph
            const node = tempGraph.addVertex(value.id, value);
            node.parents = new Set();
        })

        const notRoot = [];
         // cross check what dependencies the package has through thoth's database
        // this is used to setup edges between nodes in the graph
        Array.from(tempGraph.nodes.entries()).forEach(([key, value]) => {
            // get dependencies from thoth
            if(reformattedDeps.has(key)) {
                reformattedDeps.get(key).forEach(dep => {
                    const adjacentNode = tempGraph.nodes.get(dep.name);

                    // if package exists in lockfile
                    if (adjacentNode) {
                        // add edge connecting parent and dependency
                        tempGraph.addEdge(key, adjacentNode.value.id);
                        // set parent
                        adjacentNode.parents.add(key);
                        notRoot.push(adjacentNode.value.id);
                    }
                });
            }
            else {
                // if no record in thoth, then use metadata dependencies
                // these are not always as accurate
                if (value?.value?.metadata?.requires_dist) {
                    // for each dependency, parse to get name
                    value.value.metadata.requires_dist.forEach(async adj => {
                        const adjacentNode = tempGraph.nodes.get(
                            adj
                                .split(" ", 1)[0]
                                .toLowerCase()
                                .replace(".", "-")
                        );

                        // if package exists in lockfile
                        if (adjacentNode) {
                            // add edge connecting parent and dependency
                            tempGraph.addEdge(key, adjacentNode.value.id);
                            // set parent
                            adjacentNode.parents.add(key);
                            notRoot.push(adjacentNode.value.id);
                        }
                    });
                }
            }
        })

        /**
         * Create graph using a traversal algorithm
         */

        // add app node to graph
        const app = tempGraph.addVertex("*App", {
            id: "*App",
            label: "App",
            depth: -1
        });

        notRoot.push("*App");

        const visited = new Map();
        const visitList = [];

        // get roots and connect to app
        tempGraph.nodes.forEach((value, key, map) => {
            if (!notRoot.includes(key) || Object.keys(knownRoots).includes(key)) {
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

                for (var i = 0; i < adjs.length; i++) {
                    // update depth
                    adjs[i].value.depth = Math.min(
                        node.value.depth + 1,
                        adjs[i].value.depth ?? node.value.depth + 2
                    );
                    visitList.push(adjs[i]);
                }
            }
        }

        setGraph(tempGraph)

     }, [allDependenciesStatus, allMetadataStatus]);

    return graph

}
