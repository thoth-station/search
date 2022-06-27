import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";

import { THOTH_URL } from "config";
import { paths } from "lib/schema";

type path = paths["/python/package/version/environments"]["get"];
type requestParams = path["parameters"]["query"];
type requestResponseSuccess =
    path["responses"]["200"]["content"]["application/json"];

interface IConfig {
    params: path["parameters"]["query"];
    headers: {
        accept: "application/json";
    };
}

export const getPackageEnvironments = async (
    name: requestParams["name"],
    version: requestParams["version"],
    index: requestParams["index"],
) => {
    const config: IConfig = {
        params: {
            name: name,
            version: version,
            index: index,
        },
        headers: {
            accept: "application/json",
        },
    };
    return axios.get(
        THOTH_URL + "/python/package/version/environments",
        config,
    );
};

export const usePackageEnvironments = (
    name?: requestParams["name"],
    version?: requestParams["version"],
    index?: requestParams["index"],
    config?: { [key: string]: unknown },
) => {
    return useQuery<AxiosResponse<requestResponseSuccess>, AxiosError>({
        ...config,
        enabled: !!name && !!version && !!index,
        queryKey: ["packageEnvironments", name, version, index],
        queryFn: () =>
            getPackageEnvironments(name ?? "", version ?? "", index ?? ""),
    });
};
