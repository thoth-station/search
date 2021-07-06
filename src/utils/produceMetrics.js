import { thothGetDependencies, searchForPackage } from "services/thothApi";
import compareVersions from "tiny-version-compare";

// utils
import { Graph } from "utils/Graph";
import { validatePackage } from "utils/validatePackage";

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

    let packageWarning = [];

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

      const bfs = graph.graphSearch(
        graph.nodes.get(root.metadata.info.name + root.metadata.info.version)
      );
      const visitedOrder = Array.from(bfs);

      // depth to type of dependency
      visitedOrder.forEach(node => {
        const depth =
          node.value.depth === 0
            ? "roots"
            : node.value.depth === 1
            ? "direct"
            : "indirect";

        // is not in thoth
        if (node.value.thoth === false) {
          packageWarning.push(node);
        }

        // dependency metric
        dependencies = {
          all: {
            ...dependencies.all,
            [depth]: (dependencies.all[depth] ?? 0) + 1
          },
          roots: {
            ...dependencies.roots,
            [root.metadata.info.name + root.metadata.info.version]: {
              ...(dependencies.roots[
                root.metadata.info.name + root.metadata.info.version
              ] ?? null),
              [depth]:
                (dependencies.roots?.[
                  root.metadata.info.name + root.metadata.info.version
                ]?.[depth] ?? 0) + 1
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
    dispatch({
      type: "packageWarning",
      payload: packageWarning
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

// takes a list of start node(s) in form { name: string, *version: string } and
// sets the the new roots
export function useSetRoots(startNodes) {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (!startNodes) {
      return;
    }

    // for each package (could be one) validate
    const roots = startNodes.map(async start => {
      return validatePackage(start.name, start?.version);
    });

    Promise.all(roots).then(roots => {
      if (roots.length === 1 && roots[0] === null) {
        dispatch({
          type: "packageError",
          payload: "Package does not exist"
        });
      } else {
        dispatch({
          type: "roots",
          payload: roots
        });
      }
    });
  }, [startNodes, dispatch]);
}

export function useCreateGraph(roots, depth = -1) {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (!roots || roots.length === 0) {
      return;
    }

    // set loading
    dispatch({
      type: "loading",
      payload: { init: { amount: 0, note: "Building dependency graph." } }
    });
    let directDependencies = 0;
    let visitedDirectDependencies = 0;

    const graph = new Graph();

    // helper vars for dfs
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
      roots.forEach(r => {
        // if root package (not app) has an error
        if (r.error) {
          return;
        }

        directDependencies += r.metadata.info?.requires_dist?.length ?? 0;

        const v = {
          id: r.metadata.info.name + r.metadata.info.version,
          label: r.metadata.info.name,
          depth: 0,
          metadata: r.metadata
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

      // set loading data
      directDependencies = roots[0].metadata.info?.requires_dist?.length ?? 0;

      // if only one package
      const value = {
        id: roots[0].metadata.info.name + roots[0].metadata.info.version,
        label: roots[0].metadata.info.name,
        depth: 0,
        metadata: roots[0].metadata
      };

      const root = graph.addVertex(value.id, value);
      visitList.push(root);
    }

    (async () => {
      while (visitList.length !== 0) {
        const node = visitList.pop();
        if (node && !visited.has(node)) {
          visited.set(node);

          // loading
          if (node.value.depth === 1) {
            visitedDirectDependencies += 1;
            // set loading
            dispatch({
              type: "loading",
              payload: {
                init: {
                  amount:
                    (visitedDirectDependencies / directDependencies) * 100,
                  note: "Building dependency graph :: " + node.value.label
                }
              }
            });
          }

          if (node.value.depth !== depth) {
            // get dependencies
            await thothGetDependencies(
              node.value.metadata.info.name,
              node.value.metadata.info.version
            )
              .then(async r => {
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
              })
              .catch(e => {
                if (e?.response?.status === 404) {
                  node.value.thoth = false;
                  return;
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
