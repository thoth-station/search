import { useContext, useEffect, useState } from "react";

import { usePackagesMetadata } from "api";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { components, operations } from "../lib/schema";
import { PackageMetadata } from "../lib/types/PackageMetadata";
import { DispatchContext } from "../stores/Global";

export type Requirements = {
  "dev-packages": { [key: string]: string };
  packages: { [key: string]: string };
  requires: {
    python_version: string;
  };
  source: {
    name: string;
    url: string;
    verify_ssl: boolean;
  }[];
};

/**
 * Given a list of packages, create a graph using metadata information.
 */
export function useGraph(
  data: operations["get_python_package_version_metadata"]["parameters"]["query"][] = [],
  knownRoots?: Requirements["packages"],
  justifications?: components["schemas"]["Justification"],
) {
  const { updateLoading } = useContext(DispatchContext);
  const allMetadata = usePackagesMetadata(data);

  const [loading, setLoading] = useState(true);
  const [graph, setGraph] = useState<Graph<Node<PackageNodeValue>>>();

  useEffect(() => {
    if (!allMetadata || allMetadata.length === 0) {
      return;
    }

    updateLoading(
      "graph",
      "Loading package metadata",
      allMetadata.filter(query => !query.isLoading).length,
      allMetadata.length,
    );

    if (allMetadata.every(query => !query.isLoading)) {
      setLoading(false);
    }
  }, [allMetadata]);

  useEffect(() => {
    if (loading) {
      return;
    } else {
      updateLoading("graph");
    }

    // create graph
    const tempGraph = new Graph<Node<PackageNodeValue>>();
    const notRoot: unknown[] = [];

    // add data to graph
    allMetadata.forEach(query => {
      // if could not find metadata
      if (query.error) {
        const error = query.error;
        const params = error.response?.data?.parameters ?? error.response?.config?.params;

        const value: PackageNodeValue = {
          id: params.name.toLowerCase(),
          label: params.name + " " + params.version,
          name: params.name,
          version: params.version,
          metadata: null,
          depth: 0,
        };

        // add package to graph
        tempGraph.addVertex(value.id, value, Node);
      }
      // metadata was found
      else if (query.isSuccess) {
        const metadata = query.data.data.metadata;
        const value = {
          id: metadata.package_name.toLowerCase(),
          label: metadata.package_name + " " + metadata.package_version,
          name: metadata.package_name,
          version: metadata.package_version,
          metadata: metadata.importlib_metadata.metadata as PackageMetadata,
        };

        // add package to graph
        tempGraph.addVertex(value.id, value, Node);
      }
    });

    // set edges
    allMetadata.forEach(query => {
      if (query.status === "error" || !query.data?.data) {
        return;
      }

      const currentNode = tempGraph.nodes.get(query.data.data.metadata.package_name.toLowerCase());

      if (currentNode) {
        Object.keys(query.data.data.metadata.dependencies).forEach(dep => {
          const adjacentNode = tempGraph.nodes.get(dep);

          // if package exists in lockfile
          if (adjacentNode) {
            // add edge connecting parent and dependency
            tempGraph.addEdge(currentNode.value.id, adjacentNode.value.id);
            // set parent
            adjacentNode.parents.add(currentNode.value.id);
            notRoot.push(adjacentNode.value.id);
          }
        });
      }
    });

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

    notRoot.push("*App");

    const visited = new Set();
    const visitList: Node<PackageNodeValue>[] = [];

    // get roots and connect to app
    tempGraph.nodes.forEach((value, key) => {
      if (!notRoot.includes(key) || Object.keys(knownRoots ?? {}).includes(key)) {
        value.value.depth = 0;
        value.parents.add("*App");
        visitList.push(value);
        tempGraph.addEdge(app.key, value.key);
      }
    });

    const justifiedPackages = new Map();

    if (justifications) {
      justifications.forEach(
        (
          justification: components["schemas"]["Justification"][number] & {
            package_name?: string;
          },
        ) => {
          const key = justification.package_name ?? "*App";
          if (justifiedPackages.has(key)) {
            justifiedPackages.set(key, [...justifiedPackages.get(key), justification]);
          } else {
            justifiedPackages.set(key, [justification]);
          }
        },
      );
    }

    // set depth and parent packages using dfs
    while (visitList.length !== 0) {
      const node = visitList.pop();
      if (node && !visited.has(node)) {
        visited.add(node);

        // check if there is a justification for change
        if (justifiedPackages.has(node.key)) {
          node.value.justifications = justifiedPackages.get(node.key);
        }

        const adjs = node.getAdjacents();

        for (let i = 0; i < adjs.length; i++) {
          // update depth
          adjs[i].value.depth = Math.min(
            (node.value?.depth ?? 0) + 1,
            adjs[i].value.depth ?? (node.value?.depth ?? 0) + 2,
          );
          visitList.push(adjs[i]);
        }
      }
    }

    const visGraphEdges = new Map();

    // add edges from old graph
    tempGraph.nodes.forEach(value => {
      // set package edges
      value.adjacents.forEach(adj => {
        visGraphEdges.set(value.value.id + adj.value.id, {
          id: value.value.id + adj.value.id,
          to: value.value.id,
          from: adj.value.id,
        });
      });
    });

    // add edges to merged graph Object
    tempGraph["visEdges"] = Array.from(visGraphEdges.values());

    setGraph(tempGraph);
  }, [loading, knownRoots]);

  return graph;
}
