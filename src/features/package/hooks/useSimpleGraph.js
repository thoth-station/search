import { useEffect, useState } from "react";

// utils
import { Graph } from "utils/Graph";

/**
 * Given a list of packages, create a graph using metadata information.
 */
export function useSimpleGraph(metadata) {
    const [graph, setGraph] = useState();

    useEffect(() => {
        if (metadata.status !== "success") {
            return;
        }

        // create graph
        const tempGraph = new Graph();

        // add app node to graph
        const app = tempGraph.addVertex("*App", {
            id: "*App",
            label: "App",
            depth: -1,
        });

        const root = tempGraph.addVertex(metadata.data.data.metadata.package_name.toLowerCase(), {
            id: metadata.data.data.metadata.package_name.toLowerCase(),
            label: metadata.data.data.metadata.package_name,
            metadata: metadata.data.data.metadata.importlib_metadata.metadata,
            depth: 0
        });


        root.parents = new Set();
        root.parents.add("*App");
        tempGraph.addEdge(app.key, root.key);

        // add deps to graph
        Object.entries(metadata.data.data.metadata.dependencies).forEach(([name, value]) => {
            // add package to graph
            const node = tempGraph.addVertex(name.toLowerCase(), {
                id: name.toLowerCase(),
                label: name,
                metadata: null,
                versions: value.versions,
                specifier: value.specifier,
                extra: value.extra,
                depth: 1
            });
            node.parents = new Set();

            tempGraph.addEdge(root.key, node.key);

            // set parent
            node.parents.add(root.key);
        })


        setGraph(tempGraph);
    }, [metadata.data]);

    return graph;
}
