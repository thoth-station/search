export const PackageNotFound = ({package_name, package_version}) => {
    return <div>"{package_name}{package_version ? " " + package_version : ""}" not found</div>;
};