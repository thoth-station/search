import axios from "axios";
import { THOTH_URL } from "config";
import { useQuery, useInfiniteQuery } from "react-query";

export const getPackageVersions = async (name, page = 0) => {
    return axios.get(THOTH_URL + "/python/package/versions", {
        params: {
            name: name,
            page: page,
        },
        headers: {
            accept: "application/json",
        },
    });
};

export const usePackageVersions = (name, config) => {
    return useQuery({
        ...config,
        queryKey: ["packageVersions", name],
        queryFn: () => getPackageVersions(name),
    });
};

export const useAllPackageVersions = (name, config) => {
    return useInfiniteQuery({
        ...config,
        queryKey: ["packageVersions", name],
        queryFn: input => {
            return getPackageVersions(name, input.pageParam);
        },
        getNextPageParam: lastPage => {
            return lastPage.data.versions.length === 0
                ? undefined
                : lastPage.config.params.page + 100;
        },
    });
};
