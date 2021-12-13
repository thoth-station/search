import React from "react";
import PropTypes from "prop-types";

export const PackageNotFound = ({ package_name, package_version }) => {
    return (
        <div>
            `&quot;{package_name}
            {package_version ? " " + package_version : ""}&quot;` not found
        </div>
    );
};

PackageNotFound.propTypes = {
    package_name: PropTypes.string,
    package_version: PropTypes.string,
};
