export function formatLockfile(lockfile) {
    return Object.entries(lockfile.default).map(([key, value]) => {
        return {
            name: key,
            version: value.version.replace("==", ""),
        };
    });
}
