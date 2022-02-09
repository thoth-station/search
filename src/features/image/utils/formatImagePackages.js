export function formatImagePackages(image_packages, os) {
    return image_packages.map(p => {
            return {
                name: p.package_name,
                version: p.package_version,
                index: "https://pypi.org/simple", //TODO no hard code
                os_name: os.name,
                os_version: "34",
                python_version: "3.9",
            };
        },
    );
}
