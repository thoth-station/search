import { useEffect, useState } from "react";

export const useLicenseMetric = graph => {
    const [metric, setMetric] = useState();

    useEffect(() => {
        if (!graph) {
            return;
        }

        let base = {};

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
                const packageLicenses = [];

                // get general classification
                node?.value?.metadata?.Classifier?.forEach(classifier => {
                    const parsed = classifier.split(" :: ");

                    if (parsed[0] === "License") {
                        if (parsed[1] === "OSI Approved") {
                            packageLicenses.push({
                                generalLicense:
                                    parsed?.[2] ?? node.value.metadata.License,
                                specificLicense: node.value.metadata.License,
                                isOsiApproved: true,
                            });
                        } else {
                            packageLicenses.push({
                                generalLicense:
                                    parsed?.[1] ?? node.value.metadata.License,
                                specificLicense: node.value.metadata.License,
                                isOsiApproved: false,
                            });
                        }
                    }
                });

                if (packageLicenses.length === 0) {
                    packageLicenses.push({
                        generalLicense: node?.value?.metadata?.License ?? "N/A",
                        specificLicense:
                            node?.value?.metadata?.License ?? "N/A",
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
                                ...(base[license.generalLicense].packages ??
                                    null),
                                [node.value.label]: {
                                    depth: node.value.depth,
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
