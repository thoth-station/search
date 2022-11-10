import { useQueries, useQuery } from "@tanstack/react-query";
import {
  PackageMetadataRequestResponseSuccess,
  useAdviseDocument,
  usePackageMetadata,
  usePackagesMetadata,
} from "api";
import { Graph, Node } from "lib/interfaces";
import { PackageVersionValue } from "lib/interfaces/PackageVersionValue";
import { PythonPackageParameters } from "lib/types/PythonPackageParameters";
import { useMemo } from "react";
import { useGraph } from "./useGraph";

const queryFunction = (
  packageParameters?: PythonPackageParameters,
  packageMetadata?: PackageMetadataRequestResponseSuccess,
  justifications?: { package_name?: string; type: "WARNING" | "ERROR" | "INFO" }[],
  graph?: Graph<Node<PackageVersionValue>>,
) => {
  const packageJustifications = justifications?.filter(j => j?.package_name === packageParameters?.name);
  const node = graph?.nodes.get(packageParameters?.name as string);

  return {
    // graph dependent
    adjacent: Array.from(node?.adjacents.values() ?? []).map(adj => adj.key),
    parents: Array.from(node?.parents.values() ?? []),

    // advise document dependent
    ...packageParameters,
    warningsCount: packageJustifications?.reduce((prev, cur) => (prev + cur.type === "WARNING" ? 1 : 0), 0),
    errorCount: packageJustifications?.reduce((prev, cur) => (prev + cur.type === "ERROR" ? 1 : 0), 0),
    infoCount: packageJustifications?.reduce((prev, cur) => (prev + cur.type === "INFO" ? 1 : 0), 0),

    // metadata dependent
    size: packageMetadata?.metadata?.importlib_metadata?.files.reduce(
      (prev, cur: { size?: number }) => prev + (cur?.size ?? 0),
      0,
    ),
    license: packageMetadata?.metadata?.importlib_metadata?.metadata?.License as string,
    summary: packageMetadata?.metadata?.importlib_metadata?.metadata?.Summary as string,
    dependencies: packageMetadata?.metadata?.dependencies,
    packages: packageMetadata?.metadata?.packages,
  };
};

export const usePackageData = (package_name?: string, analysis_id?: string) => {
  const { data: graph } = useGraph(analysis_id);
  const { justifications, package_list } = useAdviseDocument(analysis_id);
  const packageParameters = useMemo(
    () => package_list?.find(pkg => pkg.name === package_name),
    [package_list, package_name],
  );
  const packageMetadata = usePackageMetadata(
    packageParameters?.name,
    packageParameters?.version,
    packageParameters?.index,
    packageParameters?.os_name,
    packageParameters?.os_version,
    packageParameters?.python_version,
  );

  const query = useQuery({
    queryKey: ["package_data", analysis_id, package_name, !!graph, !!packageMetadata],
    enabled: !!packageParameters,
    queryFn: async () => queryFunction(packageParameters, packageMetadata.data?.data, justifications, graph),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    loadingProgress: null,
    loadingText: "extracting details from package metadata",
  };
};

export const usePackagesData = (analysis_id?: string) => {
  const { package_list, justifications } = useAdviseDocument(analysis_id);
  const { data: graph } = useGraph(analysis_id);
  const packagesMetadata = usePackagesMetadata(package_list);

  const queries = useQueries({
    queries: (package_list ?? []).map(packageParameters => {
      const packageMetadata = packagesMetadata.find(
        query => query.data?.data?.parameters?.name === packageParameters.name,
      );
      return {
        queryKey: ["package_data", analysis_id, packageParameters.name, !!graph, !!packageMetadata?.data?.data],
        enabled: !!packageParameters,
        queryFn: async () => queryFunction(packageParameters, packageMetadata?.data?.data, justifications, graph),
      };
    }),
  });
  const data = useMemo(() => {
    const packagesDataList = queries.map(query => query.data);
    const packagesDataMap = new Map<string, typeof packagesDataList[number]>();
    packagesDataList.forEach(pkg => pkg?.name && packagesDataMap.set(pkg.name, pkg));
    return { packagesDataList, packagesDataMap };
  }, [queries]);

  const { isLoading, isError, progress } = useMemo(
    () =>
      queries.reduce(
        (prev, cur) => ({
          isLoading: prev.isLoading || cur.isLoading,
          isError: prev.isError || cur.isError,
          progress: prev.progress + (cur.isFetched ? 1 : 0),
        }),
        {
          isLoading: false,
          isError: false,
          progress: 0,
        },
      ),
    [queries],
  );

  return {
    data,
    isLoading,
    isError,
    loadingProgress: progress / queries.length,
    loadingText: "extracting details from package metadata",
  };
};
