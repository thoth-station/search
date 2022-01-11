import { useEffect, useState } from "react";
import { useInfinitePackageVersions } from "../api";

export const useAllVersions = package_name => {
    const versions = useInfinitePackageVersions(package_name);
    const [allVersions, setAllVersions] = useState([]);

    useEffect(() => {
        if (versions.isSuccess) {
            // if has a next page, and is not currently fetching a page
            if (versions.hasNextPage && !versions.isFetchingNextPage) {
                versions.fetchNextPage().then();
            } else if (!versions.hasNextPage && !versions.isFetchingNextPage) {
                let merged = [];
                versions.data.pages.forEach(page => {
                    merged = [...merged, ...page.data.versions];
                });
                if (merged.length > 0) {
                    merged = merged.reverse();
                    setAllVersions(merged);
                } else {
                    setAllVersions(undefined);
                }
            }
        }
    }, [versions.data]);

    return allVersions;
};
