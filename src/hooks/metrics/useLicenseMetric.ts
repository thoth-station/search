import { useEffect, useState } from "react";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";

export type LicenseMetricType = {
  /** The license name */
  [key: string]: {
    /** The packages that use this license as an object */
    packages: {
      [key: string]: {
        depth: number;
        specific?: string;
      };
    };
    /** License specific information */
    metadata: {
      /** If license is approved by OSI standards */
      isOsiApproved: boolean | null;
    };
  };
};

export const useLicenseMetric = (graph?: Graph<Node<PackageNodeValue>>) => {
  const [metric, setMetric] = useState<LicenseMetricType>();

  useEffect(() => {
    if (!graph) {
      return;
    }

    let base: LicenseMetricType = {};

    const roots: string[] = [];
    graph.nodes.forEach(value => {
      if (value.value.depth === 0) {
        roots.push(value.key);
      }
    });

    const visited = new Set();

    // for each starting node
    roots.forEach(root => {
      const rootObj = graph.nodes.get(root);
      if (!rootObj) {
        return;
      }

      const bfs = graph.graphSearch(rootObj);
      const visitedOrder = Array.from(bfs);

      visitedOrder.forEach(node => {
        if (node.key === "*App") {
          return;
        }

        if (visited.has(node.value.id)) {
          return;
        } else {
          visited.add(node.value.id);
        }

        // licence metric
        type PackageLicenses = {
          generalLicense: string;
          specificLicense?: string;
          isOsiApproved: boolean | null;
        }[];
        const packageLicenses: PackageLicenses = [];

        // get general classification
        node?.value?.metadata?.Classifier?.forEach(classifier => {
          const parsed = classifier.split(" :: ");

          if (parsed[0] === "License") {
            if (parsed[1] === "OSI Approved") {
              packageLicenses.push({
                generalLicense: parsed?.[2] ?? node.value.metadata?.License,
                specificLicense: node.value.metadata?.License,
                isOsiApproved: true,
              });
            } else {
              packageLicenses.push({
                generalLicense: parsed?.[1] ?? node.value.metadata?.License,
                specificLicense: node.value.metadata?.License,
                isOsiApproved: false,
              });
            }
          }
        });

        if (packageLicenses.length === 0) {
          packageLicenses.push({
            generalLicense: node?.value?.metadata?.License ?? "N/A",
            specificLicense: node?.value?.metadata?.License ?? "N/A",
            isOsiApproved: null,
          });
        }

        // get specific classification
        packageLicenses.forEach(license => {
          if (!base[license.generalLicense]) {
            base[license.generalLicense] = {
              packages: {},
              metadata: {
                isOsiApproved: license.isOsiApproved,
              },
            };
          }

          base = {
            ...base,
            [license.generalLicense]: {
              ...base[license.generalLicense],
              packages: {
                ...(base[license.generalLicense].packages ?? null),
                [node.value.id]: {
                  depth: node.value?.depth ?? 0,
                  specific: license.specificLicense,
                },
              },
            },
          };
        });
      });
    });

    setMetric(base);
  }, [graph]);

  return metric;
};
