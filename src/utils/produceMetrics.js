import { thothGetDependencies, searchForPackage } from "services/thothApi";
import compareVersions from "tiny-version-compare";

import { Graph } from "utils/Graph";

// redux
import { DispatchContext } from "App";

import { useContext, useEffect } from "react";

// React hook for computing metrics and applying to state
export function useComputeMetrics(roots, graph) {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (!roots || !graph) {
      return;
    }

    let dependencies = {
      all: {},
      roots: {}
    };

    let licenses = { total: undefined, all: {} };

    let starts = roots;
    if (typeof starts === "string") {
      starts = [roots];
    }

    // for each starting node
    starts.forEach(root => {
      // if the root has an error then skip it
      if (root.error) {
        return;
      }

      const bfs = graph.graphSearch(graph.nodes.get(root.name + root.version));
      const visitedOrder = Array.from(bfs);

      // depth to type of dependency
      visitedOrder.forEach(node => {
        const depth =
          node.value.depth === 0
            ? "roots"
            : node.value.depth === 1
            ? "direct"
            : "indirect";

        // dependency metric
        dependencies = {
          all: {
            ...dependencies.all,
            [depth]: (dependencies.all[depth] ?? 0) + 1
          },
          roots: {
            ...dependencies.roots,
            [root.name + root.version]: {
              ...(dependencies.roots[root.name + root.version] ?? null),
              [depth]:
                (dependencies.roots?.[root.name + root.version]?.[depth] ?? 0) +
                1
            }
          }
        };

        // licence metric
        licenses = {
          total: (licenses.total ?? 0) + 1,
          root: licenses.root ?? node.value.metadata.info.license,
          all: {
            ...licenses.all,
            [node.value.metadata.info.license]: {
              ...(licenses.all[node.value.metadata.info.license] ?? null),
              [node.value.label]: node.value.depth
            }
          }
        };
      });
    });

    // apply metrics to global state
    dispatch({
      type: "metric",
      metric: "dependencies",
      payload: dependencies
    });
    dispatch({
      type: "metric",
      metric: "licenses",
      payload: licenses
    });
  }, [graph, roots, dispatch]);
}

export function formatVisGraph(root, graph) {
  const data = {
    nodes: [],
    edges: []
  };

  const bfs = graph.graphSearch(graph.nodes.get(root));
  const visitedOrder = Array.from(bfs);

  visitedOrder.forEach(node => {
    data.nodes.push({
      id: node.value.value.id,
      label: node.value.value.label
    });
    node.value.adjacents.forEach(adj => {
      data.edges.push({
        to: node.value.value.id,
        from: adj.value.value.id
      });
    });
  });

  return data;
}

export function useCreateGraph(roots, depth = -1) {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (!roots || roots.length === 0) {
      return;
    }
    const graph = new Graph();

    // helper vars for bfs
    const visited = new Map();
    const visitList = [];

    // if more than one starting package
    if (roots.length > 1) {
      // starting app node (true root)
      const value = {
        id: "*App",
        label: "App",
        depth: -1
      };

      // add app to graph
      const root = graph.addVertex(value.id, value);

      // for each package
      roots.forEach(metadata => {
        // if root package (not app) has an error
        if (metadata.error) {
          return;
        }
        const v = {
          id: metadata.name + metadata.version,
          label: metadata.name,
          depth: 0,
          metadata: metadata
        };

        // add package to graph
        const adjacent = graph.addVertex(v.id, v);

        // add an edge between app and package
        graph.addEdge(root.key, adjacent.key);
        visitList.push(adjacent);
      });
    } else {
      // if root has an error
      if (roots[0].error) {
        return;
      }

      // if only one package
      const value = {
        id: roots[0].name + roots[0].version,
        label: roots[0].name,
        depth: 0,
        metadata: roots[0].metadata
      };

      const root = graph.addVertex(value.id, value);
      visitList.push(root);
    }

    (async () => {
      while (visitList.length !== 0) {
        const node = visitList.shift();
        if (node && !visited.has(node)) {
          visited.set(node);

          if (node.value.depth !== depth) {
            // get dependencies
            await thothGetDependencies(
              node.value.metadata.info.name,
              node.value.metadata.info.version
            ).then(async r => {
              // sort the direct dependencies by version
              const directDependencies = r.data.dependencies.sort(function(
                a,
                b
              ) {
                return compareVersions(a.version, b.version);
              });

              // this will prevent duplicate direct dependencies
              const directHaveVisited = [];

              // for each direct dependency (start at bottom to get the latest versions first)
              for (let i = directDependencies.length - 1; i >= 0; i--) {
                // only include one version of a dependency (latest)
                if (!directHaveVisited.includes(directDependencies[i].name)) {
                  // add dependency to have direct visited lookup table
                  directHaveVisited.push(directDependencies[i].name);

                  // make new node and add the edge between
                  // get metadata of  package
                  await searchForPackage(
                    directDependencies[i].name,
                    directDependencies[i].version
                  ).then(res => {
                    const v = {
                      id: res.data.info.name + res.data.info.version,
                      label: res.data.info.name,
                      depth: node.value.depth + 1,
                      metadata: res.data
                    };
                    const adjacent = graph.addVertex(v.id, v);

                    // add an edge between them
                    graph.addEdge(node.key, adjacent.key);
                    visitList.push(adjacent);
                  });
                }
              }
            });
          }
        }
      }
    })().then(() => {
      dispatch({
        type: "graph",
        payload: graph
      });
    });
  }, [roots, dispatch, depth]);
}
