import {useEffect, useMemo, useState} from "react";

export function useMetrics(oldGraph, newGraph, mergedGraph, adviseDocument) {
	const adviseMetric = useAdviseMetric(mergedGraph, adviseDocument);
	const oldDependencyMetric = useDependencyMetric(oldGraph);
	const newDependencyMetric = useDependencyMetric(newGraph);
	const oldLicenseMetric = useLicenseMetric(oldGraph);
	const newLicenseMetric = useLicenseMetric(newGraph);

	return useMemo(() => {
		const base = {
			advise: null,
			oldGraph: {dependencies: null, licenses: null},
			newGraph: {dependencies: null, licenses: null}
		};

		if (adviseMetric) {
			base.advise = adviseMetric;
		}
		if (oldDependencyMetric) {
			base.oldGraph.dependencies = oldDependencyMetric;
		}
		if (oldDependencyMetric) {
			base.oldGraph.licenses = oldLicenseMetric;
		}
		if (newDependencyMetric) {
			base.newGraph.dependencies = newDependencyMetric;
		}
		if (newLicenseMetric) {
			base.newGraph.licenses = newLicenseMetric;
		}

		return base;


	}, [adviseMetric, oldDependencyMetric, oldLicenseMetric, newDependencyMetric, newLicenseMetric]);

}

export const useDependencyMetric = (graph) => {
	const [metric, setMetric] = useState();

	useEffect(() => {
		if (!graph) {
			return;
		}

		let base = {
			all: {},
			roots: {}
		};

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

				const depth =
                    node.value.depth === 0 ? "roots" : node.value.depth === 1 ? "direct" : "indirect";

				// dependency metric
				base = {
					all: {
						...base.all,
						[depth]: (base.all[depth] ?? 0) + 1
					},
					roots: {
						...base.roots,
						[root]: {
							...(base.roots[root] ?? null),
							[depth]: (base.roots?.[root]?.[depth] ?? 0) + 1
						}
					}
				};
			});
		});

		setMetric(base);
	}, [graph]);

	return metric;
};

export const useLicenseMetric = (graph) => {
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
					packageLicenses.push({
						generalLicense: node.value.metadata.license,
						specificLicense: node.value.metadata.license,
						isOsiApproved: null
					});
				}

				// get specific classification
				packageLicenses.forEach(license => {
					if(!base[license.generalLicense]) {
						base[license.generalLicense] = {
							packages: {},
							metadata: {
								isOsiApproved: license.isOsiApproved
							}
						};
					}

					base = {
						...base,
						[license.generalLicense]: {
							...base[license.generalLicense],
							packages: {
								...(base[license.generalLicense].packages ?? null),
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

		setMetric(base);
	}, [graph]);

	return metric;
};

export const useAdviseMetric = (graph, adviseDocument) => {
	const [metric, setMetric] = useState();

	useEffect(() => {
		if (!graph || !adviseDocument) {
			return;
		}

		const base = {
			added: 0,
			removed: 0,
			version: 0,
			unchanged: 0,
			justification: {},
			build: null
		};

		// package changes
		graph.nodes.forEach(node => {
			switch (node.value.change) {
			case "added":
				base.added++;
				break;
			case "removed":
				base.removed++;
				break;
			case "version":
				base.version++;
				break;
			default:
				base.unchanged++;
			}
		});

		//build environment
		base.build = `We have analysed an application stack running on ${adviseDocument.metadata.os_release.name} ${adviseDocument.metadata.os_release.version}, running Python (${adviseDocument.metadata.python.implementation_name}) ${adviseDocument.metadata.python.major}.${adviseDocument.metadata.python.minor}.${adviseDocument.metadata.python.micro}. It was Adviser Job ID ${adviseDocument.metadata.document_id}, by ${adviseDocument.metadata.analyzer} v${adviseDocument.metadata.analyzer_version}.`;

		//justification counts
		adviseDocument?.result?.report?.products?.[0]?.justification.forEach(
			justification => {
				base.justification[justification.type] = base.justification[justification.type]
					? base.justification[justification.type] + 1
					: 1;
			}
		);
		setMetric(base);

	}, [graph, adviseDocument]);

	return metric;
};