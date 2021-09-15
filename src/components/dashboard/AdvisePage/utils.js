const whyRemoved = (start, packages) => {
  const visited = new Map();
  const visitList = [];

  visitList.push(start);

  const reasonNodes = [];

  while (visitList.length !== 0) {
    const node = visitList.pop();
    if (node && !visited.has(node)) {
      visited.set(node);

      if (node.key === "*App") {
        continue;
      } else if (node.value.change === "version") {
        reasonNodes.push(node);
      } else {
        node.parents.forEach(adj => {
          if (adj === "*App") {
            reasonNodes.push(node);
          }
          visitList.push(packages.get(adj));
        });
      }
    }
  }

  let body = "";

  if (reasonNodes.length === 0) {
    body = `${start.value.label} was removed for an unknown reason. The package does not have dependents in the Pipfile.lock and does not have any known security advisories. This is most likely due to an incomplete dependency graph.`;
  } else {
    body =
      start.value.label +
      " was removed because: " +
      reasonNodes.reduce((result, node, i) => {
        if (node.value.change === "version") {
          result +=
            "package " +
            node.value.label +
            " had its version changed to " +
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
            " does not. ";
        } else {
          result +=
            "the root package, " +
            node.value.label +
            ", was removed by the Thoth resolver. ";
        }

        return result;
      }, "");
  }

  reasonNodes.forEach(node => {
    if (node.key === "*App" && reasonNodes.length === 1) {
    } else {
      body += ``;
    }
  });

  return body;
};

export const discoverPackageChanges = (packages, justifications) => {
  if (!packages || !justifications) {
    return;
  }

  const justifiedPackages = new Map();
  justifications.forEach(justification => {
    justifiedPackages.set(justification.package_name, justification);
  });

  return Array.from(packages.values()).reduce((result, node) => {
    let justification = {
      package: node.key,
      direct: node.value.depth === 0
    };

    if (node.value.change === "removed") {
      justification.title = `${node.value.label} was removed by Thoth`;
      justification.body = whyRemoved(node, packages);
    } else if (node.value.change === "added") {
      justification.title = `${node.value.label} was added to the Pipfile.lock by Thoth`;
    }

    // check if there is a justification for change
    if (justifiedPackages.has(node.key)) {
      const reason = justifiedPackages.get(node.key);
      justification = {
        ...justification,
        body: reason.message + "\n\n" + reason.advisory,
        link: reason.link
      };
    }

    if (justification.title) {
      result.push(justification);
    }

    return result;
  }, []);
};
