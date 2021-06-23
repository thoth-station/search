import { DataSet } from "vis-network/standalone/esm/vis-network";
import { thothGetDependencies, searchForPackage } from "services/thothApi";
import compareVersions from "tiny-version-compare";

// this function populates the globla state
// with a graph of all package dependencies.
// It uses Thoth API to get dependencies.
// And uses PyPi to get metadata
export async function createDependencyGraph(
  name,
  version,
  nodes = [],
  edges = [],
  haveVisited = [],
  depth = 0
) {
  // add initial node
  if (depth === 0) {
    nodes.push({
      id: name + version,
      label: name
      //data: res.data
    });
  }

  depth += 1;

  // get initial dep list
  return await thothGetDependencies(name, version).then(async r => {
    // sort the dependencies by date using pypi metadata
    let initDeps = r.data.dependencies;
    initDeps = initDeps.sort(function(a, b) {
      return compareVersions(a.version, b.version);
    });

    for (let i = initDeps.length - 1; i >= 0; i--) {
      // only include one version of a dep (latest)
      if (!haveVisited.includes(initDeps[i].name.toLowerCase())) {
        // add dep to lookup table
        haveVisited.push(initDeps[i].name.toLowerCase());

        // get metadata of packages
        await searchForPackage(initDeps[i].name, initDeps[i].version).then(
          async res => {
            // create a network node of dep
            nodes.push({
              id: initDeps[i].name + initDeps[i].version,
              label: initDeps[i].name
              //data: res.data
            });

            // create connections
            edges.push({
              to: name + version,
              from: initDeps[i].name + initDeps[i].version
            });

            // recurse into dependency's dependencies
            // if there are dependencies
            if (
              res.data.info.requires_dist !== null &&
              res.data.info.requires_dist.length !== 0 &&
              depth < 3
            ) {
              return await createDependencyGraph(
                initDeps[i].name,
                initDeps[i].version,
                nodes,
                edges,
                haveVisited,
                depth
              ).then(r => {
                return {
                  nodes: r.nodes,
                  edges: r.edges
                };
              });
            } else {
              return {
                nodes: nodes,
                edges: edges
              };
            }
          }
        );
        // update the nodes and edges
        // nodes.concat(ps.nodes);
        // edges.concat(ps.edges);
      }
    }
    return {
      nodes: nodes,
      edges: edges
    };
  });
}
