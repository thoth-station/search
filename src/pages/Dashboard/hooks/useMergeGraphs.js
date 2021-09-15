// utils
import { Graph } from "utils/Graph";

// redux
import { DispatchContext } from "App";

import { useContext, useEffect } from "react";

import { useTheme } from "@material-ui/core/styles";

export function useMergeGraphs(oldGraph, newGraph, root) {
  const dispatch = useContext(DispatchContext);

  const theme = useTheme();

  useEffect(() => {
    if (!oldGraph || !newGraph || !root) {
      return;
    }

    const visGraphEdges = [];
    const mergedGraph = new Graph();

    newGraph.nodes.forEach((value, key) => {
      // get node
      const combinedNode = newGraph.nodes.get(key);

      // check if added, changed, or unchanged
      // if added (old graph doesnt have the package)
      if (!oldGraph.nodes.has(key)) {
        combinedNode.value = {
          ...combinedNode.value,
          change: "added",
          label:
            value.value.label + " " + (value?.value?.metadata?.version ?? ""),
          font: {
            color: theme.palette.success.main
          },
          color: theme.palette.success.main,
          version: value?.value?.metadata?.version ?? "",
          dependencies: value.adjacents.size,
          license: value?.value?.metadata?.license ?? "",
          lockfile: ["new"]
        };
      }
      // if the graph is not new then it is either equal or the version changed
      else {
        // set values that wont change
        combinedNode.value = {
          ...combinedNode.value,
          label:
            value.value.label + " " + (value?.value?.metadata?.version ?? ""),
          dependencies: value.adjacents.size,
          license: value?.value?.metadata?.license ?? "",
          lockfile: ["new", "old"]
        };
        // if the nodes are equal (version are the same)
        if (
          value?.value?.metadata?.version ===
          oldGraph.nodes.get(key)?.value?.metadata?.version
        ) {
          combinedNode.value = {
            ...combinedNode.value,
            version: value?.value?.metadata?.version ?? "",
            change: "unchanged"
          };
        }
        // if the version changed
        else {
          combinedNode.value = {
            ...combinedNode.value,
            change: "version",
            version: value?.value?.metadata?.version ?? "",
            oldVersion: oldGraph.nodes.get(key)?.value?.metadata?.version ?? "",
            font: {
              color: theme.palette.success.main
            }
          };

          combinedNode.parents = [
            ...combinedNode.parents,
            ...oldGraph.nodes.get(key)?.parents
          ];

          // merge the dependencies becouse they could be different
          oldGraph.nodes
            .get(key)
            .getAdjacents()
            .forEach(item => combinedNode.adjacents.add(item));
          newGraph.nodes
            .get(key)
            .getAdjacents()
            .forEach(item => combinedNode.adjacents.add(item));
        }
      }

      mergedGraph.nodes.set(key, combinedNode);
    });

    oldGraph.nodes.forEach((value, key) => {
      // get node
      const combinedNode = oldGraph.nodes.get(key);

      // only checking if package was removed
      if (!newGraph.nodes.has(key)) {
        combinedNode.value = {
          ...combinedNode.value,
          change: "removed",
          label:
            value.value.label + " " + (value?.value?.metadata?.version ?? ""),
          font: {
            color: theme.palette.error.main
          },
          color: theme.palette.error.main,
          version: value?.value?.metadata?.version ?? "",
          dependencies: value.adjacents.size,
          license: value?.value?.metadata?.license ?? "",
          lockfile: ["old"]
        };

        mergedGraph.nodes.set(key, combinedNode);
      }
    });

    // add edges from old graph
    oldGraph.nodes.forEach((value, key) => {
      // set package edges
      value.adjacents.forEach(adj => {
        visGraphEdges.push({
          to: value.value.id,
          from: adj.value.id,
          lockfile: "old"
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
          lockfile: "new"
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
