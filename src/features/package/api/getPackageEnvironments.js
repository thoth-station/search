import axios from "axios";
import { THOTH_URL } from "config";
import { useQuery, useInfiniteQuery } from "react-query";

export const getPackageEnvironments = async (
    name,
    version,
    index,
    page = 0,
) => {
    return axios.get(THOTH_URL + "/python/package/version/environments", {
        params: {
            name: name,
            version: version,
            index: index,
            page: page,
        },
        headers: {
            accept: "application/json",
        },
    });
};

export const usePackageEnvironments = (name, version, index, config) => {
    return useQuery({
        ...config,
        queryKey: ["packageEnvironments", name, version, index],
        queryFn: () => getPackageEnvironments(name, version, index),
    });
};

export const useInfinitePackageEnvironments = (
    name,
    version,
    index,
    config,
) => {
    return useInfiniteQuery({
        ...config,
        queryKey: ["packageEnvironments", name, version, index],
        queryFn: input => {
            return getPackageEnvironments(
                name,
                version,
                index,
                input.pageParam,
            );
        },
        getNextPageParam: lastPage => {
            return lastPage.data.environments.length === 0
                ? undefined
                : lastPage.config.params.page + 100;
        },
    });
};
