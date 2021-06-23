// utils
import { createDependencyGraph } from "utils/createDependencyGraph";

// this function creates a deep dependency graph and
// produces metrics based on it and the roots metadata
// this function can take a long amount of time if the
// graph is very large
export async function produceMetrics(metadata) {
  let state = {};

  return await createDependencyGraph(
    metadata.info.name,
    metadata.info.version,
    3
  ).then(graph => {
    // set the state objects graph data
    state.graphData = graph;

    // produce dependency Metrics
    // produce license Metrics
    // produce security metrics

    return state;
  });
}
