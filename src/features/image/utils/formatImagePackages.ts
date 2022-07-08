type ImagePackages = {
  package_name: string;
  package_version: string;
};

type OS = { name: string; version: string; python_version: string };

export function formatImagePackages(image_packages: ImagePackages[], os: OS) {
  return image_packages.map(p => {
    return {
      name: p.package_name,
      version: p.package_version,
      index: "https://pypi.org/simple",
      os_name: os.name,
      os_version: os.version,
      python_version: os.python_version,
    };
  });
}
