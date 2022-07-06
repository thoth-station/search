import { useEffect, useState } from "react";

// utils
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";

import { usePackageMetadata } from "api";
import { PackageMetadata } from "lib/types/PackageMetadata";
import { SimplePackageNodeValue } from "lib/interfaces/SimplePackageNodeValue";

export type PackageDependencyMetric = {
  extra: string[];
  extras: string[];
  marker: string;
  marker_evaluated: string;
  marker_evaluation_error: string | null;
  marker_evaluation_result: boolean;
  specifier: string;
  versions: string[];
};

/**
 * Given a list of packages, create a graph using metadata information.
 */
export function useSimpleGraph(metadata: ReturnType<typeof usePackageMetadata>) {
  const [graph, setGraph] = useState<Graph<Node<SimplePackageNodeValue>>>();

  useEffect(() => {
    if (metadata.status !== "success") {
      return;
    }

    // create graph
    const tempGraph: Graph<Node<SimplePackageNodeValue>> = new Graph();

    // add app node to graph
    const app = tempGraph.addVertex(
      "*App",
      {
        id: "*App",
        label: "App",
        depth: -1,
      },
      Node,
    );

    const root = tempGraph.addVertex(
      metadata.data.data.metadata.package_name.toLowerCase(),
      {
        id: metadata.data.data.metadata.package_name.toLowerCase(),
        label: metadata.data.data.metadata.package_name,
        metadata: metadata.data.data.metadata.importlib_metadata.metadata as PackageMetadata,
        depth: 0,
      },
      Node,
    );

    root.parents = new Set();
    root.parents.add("*App");
    tempGraph.addEdge(app.key, root.key);

    // add deps to graph
    Object.entries(
      metadata.data.data.metadata.dependencies as {
        [key: string]: PackageDependencyMetric;
      },
    ).forEach(([name, value]) => {
      // add package to graph
      const node = tempGraph.addVertex(
        name.toLowerCase(),
        {
          id: name.toLowerCase(),
          label: name,
          metadata: null,
          versions: value.versions,
          specifier: value.specifier,
          extra: value.extra,
          depth: 1,
        },
        Node,
      );
      node.parents = new Set();

      tempGraph.addEdge(root.key, node.key);

      // set parent
      node.parents.add(root.key);
    });

    setGraph(tempGraph);
  }, [metadata.data]);

  return graph;
}
