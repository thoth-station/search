import { thothSearchForPackage } from "services/thothApi";

// utils
import { Graph } from "utils/Graph";

// redux
import { DispatchContext } from "App";

import { useContext, useEffect, useState } from "react";

//vis-dataset
import { DataSet } from "vis-network/standalone/esm/vis-network";

// React hook for computing metrics and applying to state
export function useComputeMetrics(graph, roots) {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (!graph || !roots) {
      return;
    }

    let dependencies = {
      all: {},
      roots: {}
    };

    let licenses = { total: undefined, all: {} };

    // for each starting node
    Object.keys(roots).forEach(root => {
      const bfs = graph.graphSearch(graph.nodes.get(root));
      const visitedOrder = Array.from(bfs);

      // depth to type of dependency
      visitedOrder.forEach(node => {
        const depth =
          node.value.depth === 0 || root === node.value.id
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
          root: licenses.root ?? node.value.metadata.license,
          all: {
            ...licenses.all,
            [node.value.metadata.license]: {
              ...(licenses.all[node.value.metadata.license] ?? null),
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
  }, [graph, dispatch, roots]);
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

    graph.nodes.forEach((value, key, map) => {
      const node = map.get(key);
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

    setVisGraph({
      nodes: new DataSet(data.nodes),
      edges: new DataSet(data.edges)
    });
  }, [root, graph]);

  return { visGraph };
}

export function useLockFileToGraph(pipfile, pipfileLock, stateName) {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (!pipfile || !pipfileLock || !stateName) {
      return;
    }

    const graph = new Graph();

    (async () => {
      const cantBeRoots = [];

      await Promise.all(
        // create nodes
        Object.entries(pipfileLock).map(async ([key, value]) => {
          // if package in pipfile has a match in the pipfile.lock
          if (localStorage.getItem(key + value.version.replace("==", ""))) {
            const metadata = JSON.parse(
              localStorage.getItem(key + value.version.replace("==", ""))
            );
            const v = {
              id: metadata.name.toLowerCase(),
              label: metadata.name,
              depth: null,
              metadata: metadata
            };

            // add root to graph
            graph.addVertex(v.id, v);

            // add to cantBeRoots list
            metadata.requires_dist?.forEach(adj => {
              const adjacentName = adj.split(" ", 1)[0];
              const adjacentData = pipfileLock[adjacentName];

              // if package exists in lockfile
              if (adjacentData) {
                cantBeRoots.push(adjacentName);
              }
            });
          } else {
            return await thothSearchForPackage(
              key,
              value.version.replace("==", "")
            ).then(metadata => {
              const v = {
                id: metadata.name.toLowerCase(),
                label: metadata.name,
                depth: null,
                metadata: metadata
              };

              localStorage.setItem(
                key + value.version.replace("==", ""),
                JSON.stringify(metadata)
              );

              // add root to graph
              graph.addVertex(v.id, v);

              // add to cantBeRoots list
              metadata.requires_dist?.forEach(adj => {
                const adjacentName = adj.split(" ", 1)[0];
                const adjacentData = pipfileLock[adjacentName];

                // if package exists in lockfile
                if (adjacentData) {
                  cantBeRoots.push(adjacentName);
                }
              });
            });
          }
        })
      ).catch(e => {
        dispatch({
          type: "error",
          payload:
            (e.response.statusText ?? "") +
            ": an error occured while fetching package data."
        });
      });

      // get roots
      const visited = new Map();
      const visitList = [];
      graph.nodes.forEach((value, key, map) => {
        if (!cantBeRoots.includes(key) || Object.keys(pipfile).includes(key)) {
          const node = map.get(key);
          node.value.depth = 0;
          visitList.push(node);
        }
      });

      // run dfs to connect nodes

      const promiseWhile = (data, condition, action) => {
        var whilst = data => {
          return condition(data)
            ? action().then(whilst)
            : Promise.resolve(data);
        };
        return whilst(data);
      };

      await promiseWhile(
        visitList,
        i => i.length > 0,
        () => {
          const node = visitList.pop();
          if (node && !visited.has(node)) {
            visited.set(node);

            // get dependencies
            if (node?.value?.metadata?.requires_dist) {
              // for each dependency, parse to get name
              node.value.metadata.requires_dist.map(async adj => {
                const adjacentNode = graph.nodes.get(adj.split(" ", 1)[0]);

                // if package exists in lockfile
                if (adjacentNode) {
                  // update depth
                  adjacentNode.value.depth = node.value.depth + 1;

                  // add edge connecting parent and dependency
                  graph.addEdge(node.key, adjacentNode.value.id);
                  await visitList.push(adjacentNode);
                }
              });
            }
          }
          return new Promise((resolve, reject) => {
            resolve(visitList);
          });
        }
      );

      const value = {
        id: "*App",
        label: "App",
        depth: -1
      };

      // add app to graph
      const app = graph.addVertex(value.id, value);

      Object.keys(pipfile).forEach(root => {
        if (graph.nodes.get(root)) {
          graph.addEdge(app.key, root);
        }
      });
    })().then(() => {
      dispatch({
        type: "graph",
        name: stateName,
        payload: graph
      });
    });
  }, [pipfile, pipfileLock, dispatch, stateName]);
}
