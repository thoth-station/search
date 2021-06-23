import { thothGetDependencies, searchForPackage } from "services/thothApi";
import compareVersions from "tiny-version-compare";

// this function populates the globla state
// with a graph of all package dependencies.
// It uses Thoth API to get dependencies.
// And uses PyPi to get metadata
export async function createDependencyGraph(
  name,
  version,
  depth = 2,
  haveVisited = []
) {
  const nodes = [];
  const edges = [];

  // add initial node
  if (haveVisited.length === 0) {
    nodes.push({
      id: name + version,
      label: name
    });
  }

  // increase depth tracker
  depth -= 1;

  // get dep list through thoth's database
  return await thothGetDependencies(name, version)
    .then(async r => {
      // sort the direct dependencies by version
      const directDependencies = r.data.dependencies.sort(function(a, b) {
        return compareVersions(a.version, b.version);
      });

      // this will prevent duplicate direct dependencies
      const directHaveVisited = [];

      // for each direct dependency (start at bottom to et the latest versions first)
      for (let i = directDependencies.length - 1; i >= 0; i--) {
        // only include one version of a dependency (latest)
        if (!directHaveVisited.includes(directDependencies[i].name)) {
          // add dependency to have direct visited lookup table
          directHaveVisited.push(directDependencies[i].name);

          // get metadata of package
          const childTree = await searchForPackage(
            directDependencies[i].name,
            directDependencies[i].version
          ).then(async res => {
            // create network edge from dependency to parent
            edges.push({
              to: name + version,
              from: directDependencies[i].name + directDependencies[i].version
            });

            // create a network node of dependency only if
            // node has not been visited in any other branch
            if (!haveVisited.includes(directDependencies[i].name)) {
              // add dependency to overall visisted list
              haveVisited.push(directDependencies[i].name);

              // add node
              nodes.push({
                id: directDependencies[i].name + directDependencies[i].version,
                label: directDependencies[i].name,
                data: res.data,
                depth: depth
              });

              // recurse into dependency's dependencies
              // if there are dependencies and depth has not been reached
              if (
                res.data.info.requires_dist !== null &&
                res.data.info.requires_dist.length !== 0 &&
                depth !== 0
              ) {
                return await createDependencyGraph(
                  directDependencies[i].name,
                  directDependencies[i].version,
                  depth,
                  haveVisited
                ).then(r => {
                  // return child tree (nodes and edges)
                  return {
                    nodes: r.nodes,
                    edges: r.edges
                  };
                });
              }
            }
          });

          // add child tree to parent
          if (childTree) {
            for (let x = 0, len = childTree.nodes.length; x < len; x++) {
              nodes.push(childTree.nodes[x]);
            }
            for (let x = 0, len = childTree.edges.length; x < len; x++) {
              edges.push(childTree.edges[x]);
            }
          }
        }
      }

      return {
        nodes: nodes,
        edges: edges
      };
    })
    .catch(error => {
      // package or version is not in Thoth DB
      // skip its dependencies
      return {
        nodes: nodes,
        edges: edges
      };
    });
}
