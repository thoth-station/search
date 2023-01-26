import axios, { AxiosResponse } from "axios";
import { THOTH_URL } from "config";
import { useQueries, useQuery, UseQueryResult } from "@tanstack/react-query";
import { paths } from "lib/schema";
import { PipfileRequirementsLocked } from "lib/types/Pipfile";
import { useMemo } from "react";

type path = paths["/advise/python/{analysis_id}"]["get"];
export type AdviseDocumentRequestParams = path["parameters"]["path"];
export type AdviseDocumentRequestResponse = path["responses"]["200"]["content"]["application/json"] &
  path["responses"]["202"]["content"]["application/json"] &
  path["responses"]["400"]["content"]["application/json"] &
  path["responses"]["404"]["content"]["application/json"];
/**
 * An async function that returns a promise for `{base_url}/advise/python`
 *
 * @param analysis_id - the advise document id (ex: `adviser-211112223258-38af1a4746733b53`)
 */
export const getAdviseDocument = (analysis_id?: AdviseDocumentRequestParams["analysis_id"]) => {
  return axios.get<AdviseDocumentRequestResponse>(THOTH_URL + "/advise/python/" + analysis_id, {
    headers: {
      accept: "application/json",
    },
  });
};

const organizeAdviseDocument = (query: UseQueryResult<AxiosResponse<AdviseDocumentRequestResponse>>) => {
  if (!query.data?.data) {
    return {
      query: query,
    };
  }
  return {
    // all
    parameters: query.data?.data.parameters,
    data: query.data?.data,
    query: query,

    // 202
    status: query.data?.data.status,

    // 404, 400
    error: query.data?.data.error,

    // 200
    metadata: query.data?.data.metadata,
    result: query.data?.data.result,

    // 200: pulled out
    justifications: query.data?.data?.result?.report?.products?.[0].justification,
    stack_info: query.data?.data?.result?.report?.stack_info,
    project: query.data?.data?.result?.report?.products?.[0].project,
    product: query.data?.data?.result?.report?.products?.[0],

    // organize packages into a list of fully queryable packages
    package_list: (() => {
      const lockfile = query.data.data?.result?.report?.products?.[0]?.project;
      const requirements_locked = lockfile?.requirements_locked as PipfileRequirementsLocked;
      return Object.entries(requirements_locked?.default ?? {}).map(([key, value]) => {
        return {
          name: key,
          version: value.version.replace("==", ""),
          index:
            requirements_locked._meta.sources.find(source => source.name === value.index)?.url ??
            "https://pypi.org/simple",
          os_name: lockfile?.runtime_environment?.operating_system?.name ?? "",
          os_version: lockfile?.runtime_environment?.operating_system?.version ?? "",
          python_version: lockfile?.runtime_environment?.python_version ?? "",
        };
      });
    })(),
  };
};

export const useAdviseDocument = (
  analysis_id?: AdviseDocumentRequestParams["analysis_id"],
  config?: { [key: string]: unknown },
) => {
  const query = useQuery({
    ...config,
    enabled: !!analysis_id && analysis_id.startsWith("adviser"),
    queryKey: ["adviseDocument", analysis_id],
    queryFn: () => getAdviseDocument(analysis_id),
  });

  return useMemo(() => organizeAdviseDocument(query), [query.status]);
};

export const useAdviseDocuments = (
  analysis_ids: AdviseDocumentRequestParams["analysis_id"][],
  config?: { [key: string]: unknown },
) => {
  const queries = useQueries({
    queries: analysis_ids.map(id => {
      return {
        ...config,
        queryKey: ["adviseDocument", id],
        queryFn: () => getAdviseDocument(id),
      };
    }),
  });

  return [...queries.map(query => organizeAdviseDocument(query))];
};
