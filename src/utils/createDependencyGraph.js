import { DataSet } from "vis-network/standalone/esm/vis-network";
import { thothGetDependencies, searchForPackage } from "services/thothApi";
import compareVersions from "tiny-version-compare";

// this function populates the globla state
// with a graph of all package dependencies.
// It uses Thoth API to get dependencies.
// And uses PyPi to get metadata
export function createDependencyGraph(name, version) {
  const nodes = [];
  const edges = [];

  nodes.push({
    id: name + version,
    label: name
    //data: res.data
  });

  // get initial dep list
  return thothGetDependencies(name, version)
    .then(r => {
      // sort the dependencies by date using pypi metadata
      let initDeps = r.data.dependencies;
      initDeps = initDeps.sort(function(a, b) {
        return compareVersions(a.version, b.version);
      });
      return initDeps;
    })
    .then(async initDeps => {
      // recurse into each dep
      for (let i = initDeps.length - 1; i >= 0; i--) {
        // only include one version of a dep (latest)
        // get metadata of packages

        await searchForPackage(initDeps[i].name, initDeps[i].version).then(
          res => {
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
          }
        );
      }

      return {
        nodes: new DataSet(nodes),
        edges: new DataSet(edges)
      };
    });
}
