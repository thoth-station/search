import React from "react";

interface IPackageNotFound {
    package_name: string;
    package_version: string;
}

export const PackageNotFound = ({
    package_name,
    package_version,
}: IPackageNotFound) => {
    return (
        <div>
            `&quot;{package_name}
            {package_version ? " " + package_version : ""}&quot;` not found
        </div>
    );
};
