// api
import { thothSearchForPackage, getLicenses } from "services/thothApi";

// utils
import { Graph } from "utils/Graph";
import { Node } from "utils/Node";

// redux
import { DispatchContext, StateContext } from "App";

import { useContext, useEffect, useState } from "react";

import { useTheme } from "@material-ui/core/styles";

// React hook for computing metrics and applying to state
export function useComputeMetrics(graph, label) {
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);

  useEffect(() => {
    if (!state?.advise?.metadata || !state?.mergedGraph) {
      return;
    }

    const advise = {
      added: 0,
      removed: 0,
      version: 0,
      unchanged: 0,
      justification: {},
      build: null
    };

    // package changes
    state.mergedGraph.nodes.forEach(node => {
      switch (node.value.change) {
        case "added":
          advise.added++;
          break;
        case "removed":
          advise.removed++;
          break;
        case "version":
          advise.version++;
          break;
        default:
          advise.unchanged++;
      }
    });

    // build environment
    advise.build = `We have analysed an application stack running on ${state.advise.metadata.os_release.name} ${state.advise.metadata.os_release.version}, running Python (${state.advise.metadata.python.implementation_name}) ${state.advise.metadata.python.major}.${state.advise.metadata.python.minor}.${state.advise.metadata.python.micro}. It was Adviser Job ID ${state.advise.metadata.document_id}, by ${state.advise.metadata.analyzer} v${state.advise.metadata.analyzer_version}. `;

    // justification counts
    state.advise?.report?.products?.[0]?.justification.forEach(
      justification => {
        if (justification.type !== "INFO") {
          if (advise?.justification[justification.type] !== undefined) {
            advise.justification[justification.type]++;
          } else {
            advise.justification[justification.type] = 0;
          }
        }
      }
    );

    dispatch({
      type: "metric",
      metric: "advise",
      payload: advise
    });
  }, [state.mergedGraph, state.advise, dispatch]);

  // get license info
  const [licenseData, setLicenseData] = useState();
  useEffect(() => {
    getLicenses()
      .then(licenseData => {
        setLicenseData(licenseData);
      })
      .catch(() => setLicenseData({}));
  }, []);

  useEffect(() => {
    if (!graph || !licenseData) {
      return;
    }

    let dependencies = {
      all: {},
      roots: {}
    };

    let licenses = { total: undefined, all: {} };

    const roots = [];
    graph.nodes.forEach(value => {
      if (value.value.depth === 0) {
        roots.push(value.key);
      }
    });

    const visited = new Set();

    // for each starting node
    roots.forEach(root => {
      const bfs = graph.graphSearch(graph.nodes.get(root));
      const visitedOrder = Array.from(bfs);

      // depth to type of dependency
      visitedOrder.forEach(node => {
        if (visited.has(node.value.id)) {
          return;
        } else {
          visited.add(node.value.id);
        }

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
        const packageLicenses = [];

        // get general classification
        (
          node?.value?.metadata?.classifier ??
          node?.value?.metadata?.classifiers
        )?.forEach(classifier => {
          const parsed = classifier.split(" :: ");

          if (parsed[0] === "License") {
            if (parsed[1] === "OSI Approved") {
              packageLicenses.push({
                generalLicense: parsed?.[2] ?? node.value.metadata.license,
                specificLicense: node.value.metadata.license,
                isOsiApproved: true
              });
            } else {
              packageLicenses.push({
                generalLicense: parsed?.[1] ?? node.value.metadata.license,
                specificLicense: node.value.metadata.license,
                isOsiApproved: false
              });
            }
          }
        });

        if (packageLicenses.length === 0) {
          // find license in dataset
          let found = undefined;
          if (licenseData.licenses) {
            found = licenseData.licenses.find(l => {
              const lower = node.value.metadata.license.toLowerCase();
              return (
                l.name.toLowerCase() === lower ||
                l.licenseId.toLowerCase() === lower
              );
            });
          }
          if (found) {
            packageLicenses.push({
              generalLicense: found.name,
              specificLicense: found.licenseId,
              isOsiApproved: found.isOsiApproved
            });
          } else {
            packageLicenses.push({
              generalLicense: node.value.metadata.license,
              specificLicense: node.value.metadata.license,
              isOsiApproved: null
            });
          }
        }

        // get specific classification
        packageLicenses.forEach(license => {
          licenses = {
            total: (licenses.total ?? 0) + 1,
            all: {
              ...licenses.all,
              [license.generalLicense]: {
                ...(licenses.all[license.generalLicense] ?? null),
                [node.value.label]: {
                  depth: node.value.depth,
                  specific: license.specificLicense
                },
                _meta: {
                  isOsiApproved: license.isOsiApproved
                }
              }
            }
          };
        });
      });
    });

    // apply metrics to global state
    dispatch({
      type: "metric",
      metric: "dependencies",
      label: label,
      payload: dependencies
    });
    dispatch({
      type: "metric",
      metric: "licenses",
      label: label,
      payload: licenses
    });
  }, [graph, dispatch, licenseData, label]);
}

export function useMergeGraphs(oldGraph, newGraph, root) {
  const dispatch = useContext(DispatchContext);

  const theme = useTheme();

  useEffect(() => {
    if (!oldGraph || !newGraph || !root) {
      return;
    }

    const visGraphEdges = [];
    const edgeColors = new Map();
    const mergedGraph = new Graph();

    oldGraph.nodes.forEach((value, key) => {
      // if the new and old graph have the same package
      if (newGraph.nodes.has(key)) {
        // if the versions match
        const newNode = newGraph.nodes.get(key);

        newNode.value["label"] =
          newNode.value.label + " " + (newNode?.value?.metadata?.version ?? "");
        newNode.value["version"] = newNode?.value?.metadata?.version ?? "";
        newNode.value["depenencies"] = newNode.adjacents.size;
        newNode.value["license"] = newNode?.value?.metadata?.license ?? "";
        newNode.value["lockfile"] = ["new", "old"];

        console.log(root);
        if (
          key === root ||
          value.value.metadata.version === newNode.value.metadata.version
        ) {
          mergedGraph.nodes.set(newNode.key, newNode);
          newNode.value["change"] = "unchanged";
        }
        // if the versions are different
        else {
          mergedGraph.nodes.set(newNode.key, newNode);
          newNode.value["change"] = "version";
          newNode.value["font"] = {
            color: theme.palette.success.main
          };
        }
      }
      // if new graph does not have package then it is removed
      else {
        mergedGraph.nodes.set(value.key, value);
        value.value["change"] = "removed";
        value.value["label"] =
          value.value.label + " " + (value?.value?.metadata?.version ?? "");
        value.value["font"] = {
          color: theme.palette.error.main
        };
        value.value["color"] = theme.palette.error.main;
        value.value["version"] = value?.value?.metadata?.version ?? "";
        value.value["depenencies"] = value.adjacents.size;
        value.value["license"] = value?.value?.metadata?.license ?? "";
        value.value["lockfile"] = ["old"];

        edgeColors.set(value.value.id, theme.palette.error.main);
      }
    });

    // get added nodes
    newGraph.nodes.forEach((value, key) => {
      // if the old grpah does not have what new graph has
      if (!oldGraph.nodes.has(key)) {
        mergedGraph.nodes.set(value.key, value);
        value.value["change"] = "added";
        value.value["label"] =
          value.value.label + " " + (value?.value?.metadata?.version ?? "");
        value.value["font"] = {
          color: theme.palette.success.main
        };
        value.value["color"] = theme.palette.success.main;
        value.value["version"] = value?.value?.metadata?.version ?? "";
        value.value["depenencies"] = value.adjacents.size;
        value.value["license"] = value?.value?.metadata?.license ?? "";
        value.value["lockfile"] = ["new"];

        edgeColors.set(value.value.id, theme.palette.success.main);
      }
    });

    const newRoot = newGraph.nodes.get(root);
    const oldRoot = oldGraph.nodes.get(root);
    const combinedRoot = new Node(
      root,
      JSON.parse(JSON.stringify(newRoot.value))
    );
    oldRoot.getAdjacents().forEach(item => combinedRoot.adjacents.add(item));
    newRoot.getAdjacents().forEach(item => combinedRoot.adjacents.add(item));

    mergedGraph.nodes.set(root, combinedRoot);

    //r.adjacents.add(...oldRoot.adjacents, ...newRoot.adjacents);

    // add edges from old graph
    oldGraph.nodes.forEach((value, key) => {
      // set package edges
      value.adjacents.forEach(adj => {
        visGraphEdges.push({
          to: value.value.id,
          from: adj.value.id,
          color: edgeColors.get(adj.value.id) ?? undefined
        });
      });
    });

    // add edges from new graph
    newGraph.nodes.forEach((value, key) => {
      // set package edges
      value.adjacents.forEach(adj => {
        visGraphEdges.push({
          to: value.value.id,
          from: adj.value.id,
          color: edgeColors.get(adj.value.id) ?? undefined
        });
      });
    });

    // add edges to merged graph Object
    mergedGraph["visEdges"] = visGraphEdges;

    // set state
    dispatch({
      type: "graph",
      name: "mergedGraph",
      payload: mergedGraph
    });
  }, [oldGraph, newGraph, theme, root, dispatch]);
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
              id: metadata.name.toLowerCase().replace(".", "-"),
              label: metadata.name,
              depth: null,
              metadata: metadata
            };

            // add root to graph
            graph.addVertex(v.id, v);

            // add to cantBeRoots list

            metadata.requires_dist?.forEach(adj => {
              const adjacentName = adj
                .split(" ", 1)[0]
                .toLowerCase()
                .replace(".", "-");
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
                id: metadata.name.toLowerCase().replace(".", "-"),
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
                const adjacentName = adj
                  .split(" ", 1)[0]
                  .toLowerCase()
                  .replace(".", "-");
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
            (e?.response?.statusText ?? "Unknown Error") +
            ": an error occured while fetching package data."
        });
      });

      // add app to graph
      const app = graph.addVertex("*App", {
        id: "*App",
        label: "App",
        depth: -1
      });
      cantBeRoots.push("*App");

      // get roots
      const visited = new Map();
      const visitList = [];
      graph.nodes.forEach((value, key, map) => {
        if (!cantBeRoots.includes(key) || Object.keys(pipfile).includes(key)) {
          const node = map.get(key);
          node.value.depth = 0;
          visitList.push(node);

          graph.addEdge(app.key, node.key);
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
                const adjacentNode = graph.nodes.get(
                  adj
                    .split(" ", 1)[0]
                    .toLowerCase()
                    .replace(".", "-")
                );

                // if package exists in lockfile
                if (adjacentNode) {
                  // update depth
                  adjacentNode.value.depth = Math.min(
                    node.value.depth + 1,
                    adjacentNode.value.depth ?? node.value.depth + 2
                  );

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
    })().then(() => {
      dispatch({
        type: "graph",
        name: stateName,
        payload: graph
      });
    });
  }, [pipfile, pipfileLock, dispatch, stateName]);
}
