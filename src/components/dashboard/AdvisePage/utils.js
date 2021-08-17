export const formatJustifications = justifications => {
  return justifications.reduce((result, justification) => {
    if (justification.type !== "INFO") {
      result.push({
        package: justification.package_name,
        title: justification.message,
        body: justification.advisory,
        link: justification.link
      });
    }
    return result;
  }, []);
};

export const discoverPackageChanges = packages => {
  return packages.reduce((result, node) => {
    const justification = {
      package: node.key
    };
    switch (node.value.change) {
      case "removed":
        if (node.value.depth === 0) {
          justification.title = `Package ${node.value.label} was removed by Thoth`;
          justification.message = `Package ${node.value.label} did not have any dependents in the Pipfile.lock`;
        } else {
        }
      default:
    }

    return result;
  }, []);
};
