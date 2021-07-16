import { searchForPackage } from "services/thothApi";

// utils
import { Graph } from "utils/Graph";

// redux
import { DispatchContext } from "App";

import { useContext, useEffect, useState } from "react";

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

    // for each starting node
    roots.forEach(root => {
      const bfs = graph.graphSearch(graph.nodes.get(root));
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
            [root]: {
              ...(dependencies.roots[root] ?? null),
              [depth]: (dependencies.roots?.[root]?.[depth] ?? 0) + 1
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

export function useFormatVisGraph(root, graph) {
  const [visGraph, setVisGraph] = useState(undefined);

  useEffect(() => {
    if (!root || !graph) {
      return;
    }

    const data = {
      nodes: [],
      edges: []
    };

    const bfs = graph.graphSearch(graph.nodes.get(root));
    const visitedOrder = Array.from(bfs);

    visitedOrder.forEach(node => {
      data.nodes.push({
        id: node.value.id,
        label: node.value.label
      });

      node.adjacents.forEach(adj => {
        data.edges.push({
          to: node.value.id,
          from: adj.value.id
        });
      });
    });

    setVisGraph(data);
  }, [root, graph]);

  return visGraph;
}

export function useLockFileToGraph(pipfile, pipfileLock) {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (!pipfile || !pipfileLock) {
      return;
    }

    const graph = new Graph();

    (async () => {
      const visited = new Map();
      const visitList = [];
      await Promise.all(
        // set roots
        pipfile.map(async item => {
          await searchForPackage(
            item,
            pipfileLock[item].version.replace("==", "")
          ).then(res => {
            const value = {
              id: res.data.info.name.toLowerCase(),
              label: res.data.info.name,
              depth: 0,
              metadata: res.data
            };

            // add root to graph
            visitList.push(graph.addVertex(value.id, value));
          });
        })
      );

      // run dfs to connet nodes
      await Promise.all(
        Object.keys(pipfileLock).map(async i => {
          const node = visitList.pop();
          if (node && !visited.has(node)) {
            visited.set(node);

            // get dependencies
            if (node?.value?.metadata?.info?.requires_dist) {
              // for each dependency, parse to get name
              return await Promise.all(
                node.value.metadata.info.requires_dist.map(async adj => {
                  const adjacentName = adj.split(" ", 1)[0];
                  const adjacentData = pipfileLock[adjacentName];

                  // if package exists in lockfile
                  if (adjacentData) {
                    // get dependency metadata
                    await searchForPackage(
                      adjacentName,
                      adjacentData.version.replace("==", "")
                    ).then(res => {
                      const value = {
                        id: res.data.info.name.toLowerCase(),
                        label: res.data.info.name,
                        depth: node.value.depth + 1,
                        metadata: res.data
                      };

                      // add dependency to graph
                      visitList.push(graph.addVertex(value.id, value));

                      // add edge connecting parent and dependency
                      graph.addEdge(node.key, value.id);
                    });
                  }
                })
              );
            }
          }
        })
      );

      const value = {
        id: "*App",
        label: "App",
        depth: -1
      };

      // add app to graph
      const app = graph.addVertex(value.id, value);

      pipfile.forEach(root => {
        graph.addEdge(app.key, root);
      });
    })().then(() => {
      dispatch({
        type: "graph",
        payload: graph
      });
    });
  }, [pipfile, pipfileLock, dispatch]);
}
