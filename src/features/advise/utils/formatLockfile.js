export function formatLockfile(lockfile) {
    return Object.entries(lockfile.requirements_locked.default).map(
        ([key, value]) => {
            return {
                name: key,
                version: value.version.replace("==", ""),
                index: "https://pypi.org/simple", //TODO no hard code
                os_name: lockfile.runtime_environment.operating_system.name,
                os_version:
                    lockfile.runtime_environment.operating_system.version,
                python_version: lockfile.runtime_environment.python_version,
            };
        },
    );
}
