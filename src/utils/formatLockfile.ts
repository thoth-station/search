import { components, operations } from "lib/schema";

export type Lockfile = {
    default: {
        [key: string]: {
            version: string;
            markers: string;
            hashes: string[];
        };
    };
    _meta: {
        sources: {
            name: string;
            url: string;
            verify_ssl: boolean;
        }[];
    };
};

export function formatLockfile(
    lockfile: components["schemas"]["ProjectDef"],
): operations["get_python_package_version_metadata"]["parameters"]["query"][] {

    return Object.entries(
        (lockfile.requirements_locked as Lockfile).default,
    ).map(([key, value]) => {
        return {
            name: key,
            version: value.version.replace("==", ""),
            index: "https://pypi.org/simple", //TODO no hard code
            os_name:
                lockfile?.runtime_environment?.operating_system?.name ?? "",
            os_version:
                lockfile?.runtime_environment?.operating_system?.version ?? "",
            python_version: lockfile?.runtime_environment?.python_version ?? "",
        };
    });
}
