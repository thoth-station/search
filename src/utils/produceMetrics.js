// utils
import { createDependencyGraph } from "utils/createDependencyGraph";

// this function creates a deep dependency graph and
// produces metrics based on it and the roots metadata
// this function can take a long amount of time if the
// graph is very large
export function produceShallowMetrics(metadata) {
  let state = {};

  state.metrics = {};

  // produce dependency metrics
  state.metrics.dependencies = {
    direct: metadata.info.requires_dist?.length ?? 0
  };

  // set state
  state.metrics = {
    dependencies: {
      direct: metadata.info.requires_dist?.length ?? 0
    },
    licenses: {
      root: metadata.info.license
    }
  };

  return state;
}

// this function creates a deep dependency graph and
// produces metrics based on it and the roots metadata
// this function can take a long amount of time if the
// graph is very large
export async function produceDeepMetrics(metadata, depth = -1) {
  let state = {};

  return await createDependencyGraph(
    metadata.info.name,
    metadata.info.version,
    depth
  ).then(graph => {
    // set the state objects graph data
    state.graph = graph;

    state.metrics = {};

    // for each dependency get update total metrics
    let licenses = {};
    graph.nodes.forEach(node => {
      // produce dependency metrics if not root
      if (node.metadata) {
        // existing licence

        if (licenses[node.metadata.info.license]) {
          licenses[node.metadata.info.license] += 1;
        }
        // new license
        licenses[node.metadata.info.license] = 1;
      }
    });

    // set state
    state.metrics = {
      dependencies: {
        indirect:
          graph.nodes.length - (metadata.info.requires_dist?.length ?? 0) - 1
      },
      licenses: {
        all: licenses
      }
    };

    // produce license Metrics
    // produce security metrics

    return state;
  });
}
