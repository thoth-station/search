import axios from "axios";
import { THOTH_URL } from "config";
import { useQuery, useInfiniteQuery } from "react-query";

export const getContainerImages = async (name, page = 0, per_page = 100) => {
    return axios.get(THOTH_URL + "/container-images", {
        params: {
            page: page,
            per_page: per_page,
        },
        headers: {
            accept: "application/json",
        },
    });
};

export const useContainerImages = config => {
    return useQuery({
        ...config,
        queryKey: ["container-images"],
        queryFn: () => getContainerImages(),
    });
};

export const useInfiniteContainerImages = config => {
    return useInfiniteQuery({
        ...config,
        queryKey: ["container-images"],
        queryFn: input => {
            return getContainerImages(input.pageParam);
        },
        getNextPageParam: lastPage => {
            return lastPage.data.versions.length === 0
                ? undefined
                : lastPage.data.parameters.page + 1;
        },
    });
};
