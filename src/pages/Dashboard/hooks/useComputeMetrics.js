// api
import { getLicenses } from "services/thothApi";

// redux
// import { DispatchContext, StateContext } from "App";
//
 import { useContext, useEffect, useState } from "react";

// React hook for computing metrics and applying to state
export function useComputeMetrics(graph, label) {
  // const dispatch = useContext(DispatchContext);
  // const state = useContext(StateContext);

  useEffect(() => {
    // if (!state?.advise?.metadata || !state?.mergedGraph) {
    //   return;
    // }

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

    //build environment
    advise.build = `We have analysed an application stack running on ${state.advise.metadata.os_release.name} ${state.advise.metadata.os_release.version}, running Python (${state.advise.metadata.python.implementation_name}) ${state.advise.metadata.python.major}.${state.advise.metadata.python.minor}.${state.advise.metadata.python.micro}. It was Adviser Job ID ${state.advise.metadata.document_id}, by ${state.advise.metadata.analyzer} v${state.advise.metadata.analyzer_version}. `;

    //justification counts
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
  }, []);

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

    let licenses = { };

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
        if (node.key === "*App") {
          return;
        }

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
          if(!licenses[license.generalLicense]) {
            licenses[license.generalLicense] = {
              packages: {},
              metadata: {
                isOsiApproved: license.isOsiApproved
              }
            }
          }

          licenses = {
            ...licenses,
            [license.generalLicense]: {
              ...licenses[license.generalLicense],
              packages: {
                ...(licenses[license.generalLicense].packages ?? null),
                [node.value.label]: {
                  depth: node.value.depth,
                  specific: license.specificLicense
                },
              }
            }
          };

        });
      });
    });

    //apply metrics to global state
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
  }, [graph, licenseData, label]);
}
