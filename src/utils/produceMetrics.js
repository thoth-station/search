// utils
import { createDependencyGraph } from "utils/createDependencyGraph";

import { thothGetDependencies, searchForPackage } from "services/thothApi";
import compareVersions from "tiny-version-compare";

import { Graph } from "utils/Graph";
import { Node } from "utils/Node";

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

export async function createGraph(rootMetadata, depth = -1) {
  const graph = new Graph();

  const value = {
    id: rootMetadata.info.name + rootMetadata.info.version,
    label: rootMetadata.info.name,
    depth: 0,
    metadata: rootMetadata
  };

  const root = graph.addVertex(value.id, value);

  const visited = new Map();
  const visitList = [];

  visitList.push(root);

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
          const directDependencies = r.data.dependencies.sort(function(a, b) {
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
  return graph;
}
