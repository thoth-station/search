import { useEffect, useState } from "react";
import { useInfinitePackageEnvironments } from "../api";

export const useAllEnvironments = (
    package_name,
    package_version,
    index_url,
) => {
    const environments = useInfinitePackageEnvironments(
        package_name,
        package_version,
        index_url,
        { useErrorBoundary: false },
    );
    const [allEnvironments, setAllEnvironments] = useState([]);

    useEffect(() => {
        if (environments.isSuccess) {
            // if has a next page, and is not currently fetching a page
            if (environments.hasNextPage && !environments.isFetchingNextPage) {
                environments.fetchNextPage().then();
            } else if (
                !environments.hasNextPage &&
                !environments.isFetchingNextPage
            ) {
                let merged = [];
                environments.data.pages.forEach(page => {
                    merged = [...merged, ...page.data.environments];
                });
                merged = merged.reverse();
                setAllEnvironments(merged);
            }
        }
    }, [environments.data]);

    return allEnvironments;
};
