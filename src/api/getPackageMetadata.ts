import axios, { AxiosError, AxiosResponse } from "axios";
import { THOTH_URL } from "config";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { paths } from "lib/schema";

type path = paths["/python/package/version/metadata"]["get"];
type requestParams = path["parameters"]["query"];
export type PackageMetadataRequestResponseSuccess = path["responses"]["200"]["content"]["application/json"];
type requestResponseFailure = path["responses"]["404"]["content"]["application/json"];

interface IConfig {
  params: path["parameters"]["query"];
  headers: {
    accept: "application/json";
  };
}

export const getPackageMetadata = (
  name: requestParams["name"],
  version: requestParams["version"],
  index: requestParams["index"],
  os_name: requestParams["os_name"],
  os_version: requestParams["os_version"],
  python_version: requestParams["python_version"],
) => {
  const config: IConfig = {
    params: {
      name: name,
      version: version,
      index: index,
      os_name: os_name,
      os_version: os_version,
      python_version: python_version,
    },
    headers: {
      accept: "application/json",
    },
  };
  return axios.get<PackageMetadataRequestResponseSuccess>(THOTH_URL + "/python/package/version/metadata", config);
};

export const usePackageMetadata = (
  name?: requestParams["name"],
  version?: requestParams["version"],
  index?: requestParams["index"],
  os_name?: requestParams["os_name"],
  os_version?: requestParams["os_version"],
  python_version?: requestParams["python_version"],
  config?: { [key: string]: any },
): UseQueryResult<AxiosResponse<PackageMetadataRequestResponseSuccess>, AxiosError<requestResponseFailure>> => {
  return useQuery<AxiosResponse<PackageMetadataRequestResponseSuccess>, AxiosError<requestResponseFailure>>({
    ...config,
    enabled: !!name && !!version && !!index && !!os_name && !!os_version && !!python_version,
    queryKey: ["packageMetadata", name, version, index, os_name, os_version, python_version],
    queryFn: () =>
      getPackageMetadata(name ?? "", version ?? "", index ?? "", os_name ?? "", os_version ?? "", python_version ?? ""),
  });
};

export const usePackagesMetadata = (
  packages: requestParams[] = [],
  config?: { [key: string]: any },
): UseQueryResult<AxiosResponse<PackageMetadataRequestResponseSuccess>, AxiosError<requestResponseFailure>>[] => {
  return useQueries({
    queries: packages.map(p => {
      return {
        ...config,
        enabled: !!p.name && !!p.version && !!p.index && !!p.os_name && !!p.os_version && !!p.python_version,
        queryKey: ["packageMetadata", p.name, p.version, p.index, p.os_name, p.os_version, p.python_version],
        queryFn: () => getPackageMetadata(p.name, p.version, p.index, p.os_name, p.os_version, p.python_version),
      };
    }),
  }) as UseQueryResult<AxiosResponse<PackageMetadataRequestResponseSuccess>, AxiosError<requestResponseFailure>>[];
};
