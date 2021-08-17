import { useContext, useEffect } from "react";

// api
import { thothSearchForPackage, thothGetDependencies } from "services/thothApi";

// utils
import { Graph } from "utils/Graph";

// redux
import { DispatchContext } from "App";

export function useLockFileToGraph(pipfile, pipfileLock, stateName) {
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    if (!pipfile || !pipfileLock || !stateName) {
      return;
    }

    const graph = new Graph();

    (async () => {
      await Promise.all(
        Object.entries(pipfileLock).map(async ([key, value]) => {
          // get package metadata
          return thothSearchForPackage(
            key,
            value.version.replace("==", "")
          ).then(metadata => {
            const v = {
              id: metadata.name.toLowerCase().replace(".", "-"),
              label: metadata.name,
              metadata: metadata
            };

            // add package to graph
            graph.addVertex(v.id, v);
          });
        })
      );
    }).catch(e => {
      dispatch({
        type: "error",
        payload:
          (e?.response?.statusText ?? "Unknown Error") +
          ": an error occured while fetching package data."
      });
    });

    // create edges between nodes
    const notRoot = [];
    graph.nodes.forEach(async (value, key) => {
      // get dependencies through thoth
      await thothGetDependencies(
        value.value?.metadata?.name,
        value.value?.metadata?.version
      )
        .then(deps => {
          deps.data.dependencies.forEach(dep => {
            const adjacentNode = graph.nodes.get(dep.name);

            // if package exists in lockfile
            if (adjacentNode) {
              // add edge connecting parent and dependency
              graph.addEdge(key, adjacentNode.value.id);
              notRoot.push(adjacentNode.value.id);
            }
          });
        })
        // if no record in thoth, then use metadata
        .catch(() => {
          if (value?.value?.metadata?.requires_dist) {
            // for each dependency, parse to get name
            value.value.metadata.requires_dist.forEach(async adj => {
              const adjacentNode = graph.nodes.get(
                adj
                  .split(" ", 1)[0]
                  .toLowerCase()
                  .replace(".", "-")
              );

              // if package exists in lockfile
              if (adjacentNode) {
                // add edge connecting parent and dependency
                graph.addEdge(key, adjacentNode.value.id);
                notRoot.push(adjacentNode.value.id);
              }
            });
          }
        });
    });

    // add app node to graph
    const app = graph.addVertex("*App", {
      id: "*App",
      label: "App",
      depth: -1
    });

    const visited = new Map();
    const visitList = [];

    // get roots and connect to app
    graph.nodes.forEach((value, key, map) => {
      if (!notRoot.includes(key) || Object.keys(pipfile).includes(key)) {
        const node = map.get(key);
        node.value.depth = 0;
        node.value.parent = "*App";
        visitList.push(node);
        graph.addEdge(app.key, node.key);
      }
    });

    // set depth and parent packages using dfs
    let currentParent = null;
    while (visitList.length !== 0) {
      const node = visitList.pop();
      if (node && !visited.has(node)) {
        if (node.value?.depth === 0) {
          currentParent = node.key;
        }

        visited.set(node);

        const adjs = node.getAdjacents();

        for (var i = 0; i < adjs.length; i++) {
          // set parent
          adjs[i].value.parent = currentParent;

          // update depth
          adjs[i].value.depth = Math.min(
            node.value.depth + 1,
            node.value.depth ?? node.value.depth + 2
          );
          visitList.push(adjs[i]);
        }
      }
    }

    dispatch({
      type: "graph",
      name: stateName,
      payload: graph
    });
  }, [pipfile, pipfileLock, dispatch, stateName]);
}
