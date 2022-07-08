import axios, { AxiosError, AxiosResponse } from "axios";
import { THOTH_URL } from "config";
import { useQueries, useQuery } from "react-query";
import { paths } from "lib/schema";
import { UseQueryResult } from "react-query/types/react/types";

type path = paths["/advise/python/{analysis_id}"]["get"];
export type AdviseDocumentRequestParams = path["parameters"]["path"];
export type AdviseDocumentRequestResponseSuccess = path["responses"]["200"]["content"]["application/json"] &
  path["responses"]["202"]["content"]["application/json"];
type requestResponseFailure = path["responses"]["400"]["content"]["application/json"] &
  path["responses"]["404"]["content"]["application/json"];
/**
 * An async function that returns a promise for `{base_url}/advise/python`
 *
 * @param analysis_id - the advise document id (ex: `adviser-211112223258-38af1a4746733b53`)
 */
export const getAdviseDocument = (analysis_id?: AdviseDocumentRequestParams["analysis_id"]) => {
  return axios.get<AdviseDocumentRequestResponseSuccess>(THOTH_URL + "/advise/python/" + analysis_id, {
    headers: {
      accept: "application/json",
    },
  });
};

export const useAdviseDocument = (
  analysis_id?: AdviseDocumentRequestParams["analysis_id"],
  config?: { [key: string]: unknown },
): UseQueryResult<AxiosResponse<AdviseDocumentRequestResponseSuccess>, AxiosError<requestResponseFailure>> => {
  return useQuery({
    ...config,
    enabled: !!analysis_id && analysis_id.startsWith("adviser"),
    queryKey: ["adviseDocument", analysis_id],
    queryFn: () => getAdviseDocument(analysis_id),
  });
};

export const useAdviseDocuments = (
  analysis_ids: AdviseDocumentRequestParams["analysis_id"][],
  config?: { [key: string]: unknown },
): UseQueryResult<AxiosResponse<AdviseDocumentRequestResponseSuccess>, AxiosError<requestResponseFailure>>[] => {
  return useQueries(
    analysis_ids.map(id => {
      return {
        ...config,
        queryKey: ["adviseDocument", id],
        queryFn: () => getAdviseDocument(id),
      };
    }),
  ) as UseQueryResult<AxiosResponse<AdviseDocumentRequestResponseSuccess>, AxiosError<requestResponseFailure>>[];
};
