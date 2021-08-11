//utils
import { Graph } from "utils/Graph";
import { useState, useEffect } from "react";

// applys filters to the merged graph
export const useFilterGraph = (filter, root, mergedGraph) => {
  const [filteredGraph, setFilteredGraph] = useState();

  useEffect(() => {
    if (!filter || !mergedGraph.nodes || !mergedGraph.visEdges || !root) {
      return;
    }

    const filteredNodes = new Map();
    mergedGraph.nodes.forEach((value, key) => {
      let passing = true;
      Object.entries(filter).forEach(([paramName, paramDetails]) => {
        if (paramDetails.query !== "") {
          if (paramName === "lockfile") {
            passing =
              (paramDetails.query === "both" ||
                value.value[paramName].includes(paramDetails.query)) &&
              passing;
            return;
          } else if (key === root) {
            return;
          }

          const compare = isNaN(Number(value.value[paramName]))
            ? value.value[paramName]
            : Number(value.value[paramName]);

          const query = isNaN(Number(paramDetails.query))
            ? paramDetails.query
            : Number(paramDetails.query);

          switch (paramDetails.operator) {
            case "=":
              passing = query === compare && passing;
              break;
            case "!=":
              passing = query !== compare && passing;
              break;
            case ">":
              passing = compare > query && passing;
              break;
            case ">=":
              passing = compare >= query && passing;
              break;
            case "<":
              passing = compare < query && passing;
              break;
            case "<=":
              passing = compare <= query && passing;
              break;
            case "~":
              passing =
                value.value[paramName].includes(paramDetails.query) && passing;
              break;
            case "!~":
              passing =
                !value.value[paramName].includes(paramDetails.query) && passing;
              break;
            default:
              if (query) {
                passing = query && passing;
              }
          }
        }
      });
      if (passing) {
        filteredNodes.set(key, mergedGraph.nodes.get(key));
      }
    });

    const graph = new Graph();
    graph.nodes = filteredNodes;
    graph.visEdges = mergedGraph.visEdges;

    setFilteredGraph(graph);
  }, [filter, mergedGraph, root]);

  return filteredGraph;
};
