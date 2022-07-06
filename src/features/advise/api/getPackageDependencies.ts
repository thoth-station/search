import axios, { AxiosError, AxiosResponse } from "axios";
import { THOTH_URL } from "config";
import { useQueries, useQuery } from "react-query";
import { paths } from "lib/schema";

type path = paths["/python/package/dependencies"]["get"];
type requestParams = path["parameters"]["query"];
type requestResponseSuccess = path["responses"]["200"]["content"]["application/json"];
type requestResponseFailure = path["responses"]["404"]["content"]["application/json"];

interface IConfig {
  params: path["parameters"]["query"];
  headers: {
    accept: "application/json";
  };
}

export const getPackageDependencies = (
  name: requestParams["name"],
  version: requestParams["version"],
  index: requestParams["index"] = "https://pypi.org/simple",
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
  return axios.get<requestResponseSuccess>(THOTH_URL + "/python/package/dependencies", config);
};

export const usePackageDependencies = (
  name: requestParams["name"],
  version: requestParams["version"],
  config: { [key: string]: unknown },
) => {
  return useQuery<AxiosResponse<requestResponseSuccess>, AxiosError<requestResponseFailure>>({
    ...config,
    queryKey: ["packageDependencies", name, version],
    queryFn: () => getPackageDependencies(name, version),
  });
};

export const usePackagesDependencies = (
  packages: {
    name: requestParams["name"];
    version: requestParams["version"];
  }[],
  config: { [key: string]: unknown },
) => {
  return useQueries(
    packages.map(p => {
      return {
        ...config,
        queryKey: ["packageDependencies", p.name, p.version],
        queryFn: () => getPackageDependencies(p.name, p.version),
      };
    }),
  );
};
