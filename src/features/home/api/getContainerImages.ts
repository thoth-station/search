import axios, { AxiosError, AxiosResponse } from "axios";
import { useInfiniteQuery, useQuery } from "react-query";

import { THOTH_URL } from "config";
import { paths } from "lib/schema";

type path = paths["/container-images"]["get"];
type requestParams = path["parameters"]["query"];
type requestResponseSuccess =
    path["responses"]["200"]["content"]["application/json"];
type requestResponseFailure =
    path["responses"]["400"]["content"]["application/json"];

interface IConfig {
    params: path["parameters"]["query"];
    headers: {
        accept: "application/json";
    };
}

export const getContainerImages = async (
    page: requestParams["page"] = 0,
    per_page: requestParams["per_page"] = 100,
) => {
    const config: IConfig = {
        params: {
            page: page,
            per_page: per_page,
        },
        headers: {
            accept: "application/json",
        },
    };
    return axios.get<requestResponseSuccess>(
        THOTH_URL + "/container-images",
        config,
    );
};

export const useContainerImages = (config: { [key: string]: unknown }) => {
    return useQuery<
        AxiosResponse<requestResponseSuccess>,
        AxiosError<requestResponseFailure>
    >({
        ...config,
        queryKey: ["container-images"],
        queryFn: () => getContainerImages(),
    });
};

export const useInfiniteContainerImages = (config: {
    [key: string]: unknown;
}) => {
    return useInfiniteQuery<
        AxiosResponse<requestResponseSuccess>,
        AxiosError<requestResponseFailure>
    >({
        ...config,
        queryKey: ["container-images"],
        queryFn: input => {
            return getContainerImages(input.pageParam);
        },
        getNextPageParam: (lastPage: AxiosResponse<requestResponseSuccess>) => {
            return lastPage.data.container_images.length === 0
                ? undefined
                : lastPage.data.parameters.page + 1;
        },
    });
};
