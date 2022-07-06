import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";

import { THOTH_URL } from "config";
import { paths } from "lib/schema";

type path = paths["/python/package/versions"]["get"];
type requestParams = path["parameters"]["query"];
export type PackageVersionsRequestResponseSuccess = path["responses"]["200"]["content"]["application/json"];
type requestResponseFailure = path["responses"]["404"]["content"]["application/json"];

interface IConfig {
  params: path["parameters"]["query"];
  headers: {
    accept: "application/json";
  };
}

export const getPackageVersions = async (name: requestParams["name"]) => {
  const config: IConfig = {
    params: {
      name: name,
    },
    headers: {
      accept: "application/json",
    },
  };

  return axios.get<PackageVersionsRequestResponseSuccess>(THOTH_URL + "/python/package/versions", config);
};

export const usePackageVersions = (name: requestParams["name"], config?: { [key: string]: unknown }) => {
  return useQuery<AxiosResponse<PackageVersionsRequestResponseSuccess>, AxiosError<requestResponseFailure>>({
    ...config,
    enabled: !!name,
    queryKey: ["packageVersions", name],
    queryFn: () => getPackageVersions(name),
  });
};
