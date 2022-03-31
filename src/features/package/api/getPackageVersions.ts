import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery, useInfiniteQuery } from "react-query";

import { THOTH_URL } from "config";
import { paths } from "lib/schema";

type path = paths["/python/package/versions"]["get"];
type requestParams = path["parameters"]["query"];
export type PackageVersionsRequestResponseSuccess =
    path["responses"]["200"]["content"]["application/json"];
type requestResponseFailure =
    path["responses"]["404"]["content"]["application/json"];

export const getPackageVersions = async (
    name: requestParams["name"],
    page: requestParams["page"] = 0,
    per_page: requestParams["per_page"] = 100,
) => {
    return axios.get<PackageVersionsRequestResponseSuccess>(
        THOTH_URL + "/python/package/versions",
        {
            params: {
                name: name,
                page: page,
                per_page: per_page,
            },
            headers: {
                accept: "application/json",
            },
        },
    );
};

export const usePackageVersions = (
    name: requestParams["name"],
    config?: { [key: string]: unknown },
) => {
    return useQuery<
        AxiosResponse<PackageVersionsRequestResponseSuccess>,
        AxiosError<requestResponseFailure>
    >({
        ...config,
        enabled: !!name,
        queryKey: ["packageVersions", name],
        queryFn: () => getPackageVersions(name),
    });
};

export const useInfinitePackageVersions = (
    name: requestParams["name"],
    config?: { [key: string]: unknown },
) => {
    return useInfiniteQuery<
        AxiosResponse<PackageVersionsRequestResponseSuccess>,
        AxiosError<requestResponseFailure>
    >({
        ...config,
        enabled: !!name,
        queryKey: ["packageVersions", name],
        queryFn: input => {
            return getPackageVersions(name, input.pageParam);
        },
        getNextPageParam: lastPage => {
            const parameters: requestParams = (
                lastPage.data as typeof lastPage.data & {
                    parameters: requestParams;
                }
            ).parameters;
            return lastPage.data.versions.length === 0
                ? undefined
                : (parameters.page ?? 0) + 1;
        },
    });
};
