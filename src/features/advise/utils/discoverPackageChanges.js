const whyRemoved = (start, packages) => {
    const visited = new Map();
    const visitList = [];

    visitList.push(start);

    const reasonNodes = [];

    while (visitList.length !== 0) {
        const node = visitList.pop();
        if (node && !visited.has(node)) {
            visited.set(node);

            if (node.value.change === "version") {
                reasonNodes.push(node);
            } else {
                node.parents.forEach(adj => {
                    if (adj === "*App" && node.key !== start.key) {
                        reasonNodes.push(node);
                    }
                    visitList.push(packages.get(adj));
                });
            }
        }
    }

    return reasonNodes.map(node => {
        const reason =
            node.value.change === "version"
                ? " had its version changed to " +
                  node.value.version +
                  " from " +
                  node.value.oldVersion +
                  ". Version " +
                  node.value.oldVersion +
                  " of " +
                  node.key +
                  " included package " +
                  start.value.label +
                  " as a dependency, where version " +
                  node.value.version +
                  " does not. "
                : " did not have any dependents and was removed by the Thoth resolver.";
        return {
            package: node.key,
            reason: reason,
        };
    });
};

export const discoverPackageChanges = (nodes, justifications) => {
    if (!nodes || !justifications) {
        return;
    }

    const justifiedPackages = new Map();
    justifications.forEach(justification => {
        if (justification.package_name) {
            if (justifiedPackages.has(justification.package_name)) {
                justifiedPackages.set(justification.package_name, [
                    ...justifiedPackages.get(justification.package_name),
                    justification,
                ]);
            } else {
                justifiedPackages.set(justification.package_name, [
                    justification,
                ]);
            }
        }
    });

    nodes.forEach(node => {
        let justification = {
            package: node.key,
        };

        if (node.value.change === "removed") {
            // set header
            justification.header = `${node.value.label} was ${
                node.value.depth === 0 ? "directly" : "indirectly"
            } removed by Thoth resolver.`;

            // set reasons for removal
            justification.reasons = whyRemoved(node, nodes);

            // if no reasons for removal
            if (justification.reasons.length === 0) {
                justification.header = `${node.value.label} was removed for an unknown reason. The package does not have dependents in the Pipfile.lock.`;
            }
        }
        // if added
        else if (node.value.change === "added") {
            justification.header = `${node.value.label} was added to the Pipfile.lock by Thoth resolver.`;
        }

        // if added
        else if (node.value.change === "version") {
            justification.header = `${node.key} had its version changed from ${node.value.oldVersion} to ${node.value.version}.`;
        }

        // if unchanged
        else {
            justification.header =
                "Thoth resolver did not remove or change package " +
                node.value.label +
                ".";
        }

        // check if there is a justification for change
        if (justifiedPackages.has(node.key)) {
            const reasons = justifiedPackages.get(node.key);
            justification = {
                ...justification,
                thoth: reasons,
            };
        }

        node.value.justifications = justification;
    }, []);
};
