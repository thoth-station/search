import {useMemo, useEffect, useState} from "react";

// utils
import { Graph } from "utils/Graph";

// api
import {usePackagesMetadata} from "features/misc/api";

export function useGraphKnownEdges(data, dependency_graph) {
    const allMetadata = usePackagesMetadata(data);

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


    const [graph, setGraph] = useState();

    useEffect(() => {
        if(allMetadataStatus !== "success") {
            // handle error
            return;
        }

        // create graph
        const tempGraph = new Graph();

        // merge data together
        allMetadata.forEach(query => {
            const metadata = query.data.data.metadata ?? query.data.data.info;

            const value = {
                id: metadata.name.toLowerCase(),
                label: metadata.name,
                metadata: metadata
            };

            // add package to graph
            const node = tempGraph.addVertex(value.id, value);
            node.parents = new Set();
        })

        const app = tempGraph.addVertex("*App", {
            id: "*App",
            label: "App",
            depth: -1
        });

        const roots = new Set([...Array(dependency_graph.nodes.length).keys()]);

        dependency_graph.edges.forEach(edge => {
            roots.delete(edge[1])

            const toNode = tempGraph.nodes.get(dependency_graph.nodes[edge[1]].toLowerCase())
            const fromNode = tempGraph.nodes.get(dependency_graph.nodes[edge[0]].toLowerCase())
            // add edge connecting parent and dependency
            tempGraph.addEdge(fromNode, toNode);
            // set parent
            toNode.parents.add(dependency_graph.nodes[edge][0].toLowerCase());
        })

        roots.forEach(root => {
            const toNode = tempGraph.nodes.get(dependency_graph.nodes[root].toLowerCase())

            // add edge connecting parent and dependency
            tempGraph.addEdge(app, toNode);
            // set parent
            toNode.parents.add(app.key);
        })


        const visited = new Set();
        const visitList = [];

        // set depth  using dfs
        while (visitList.length !== 0) {
            const node = visitList.pop();
            if (node && !visited.has(node)) {
                visited.add(node);

                const adjs = node.getAdjacents();

                for (let i = 0; i < adjs.length; i++) {
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
        console.log(tempGraph)
// eslint-disable-next-line react-hooks/exhaustive-deps
     }, [allMetadataStatus]);

    return graph

}
