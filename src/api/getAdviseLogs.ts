import axios, { AxiosError, AxiosResponse } from "axios";
import { THOTH_URL } from "config";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { paths } from "lib/schema";

type path = paths["/advise/python/{analysis_id}/log"]["get"];
type requestParams = path["parameters"]["path"];
type requestResponse = path["responses"]["200"]["content"]["application/json"] &
  path["responses"]["400"]["content"]["application/json"] &
  path["responses"]["404"]["content"]["application/json"];
/**
 * An async function that returns a promise for `{base_url}/advise/python/logs`
 *
 * @param analysis_id - the advise document id (ex: `adviser-211112223258-38af1a4746733b53`)
 */
export const getAdviseLogs = async (analysis_id?: requestParams["analysis_id"]) => {
  return axios.get<requestResponse>(THOTH_URL + "/advise/python/" + analysis_id + "/log", {
    headers: {
      accept: "application/json",
    },
  });
};

const organizeQuery = (query: UseQueryResult<AxiosResponse<requestResponse>>) => {
  if (!query.data?.data) {
    return {
      query: query,
    };
  }
  return {
    // all
    parameters: query.data?.data.parameters,
    data: query.data?.data,

    // 404, 400
    error: query.data?.data.error,

    // 200
    log: query.data?.data.log,

    // 200: pulled out
    lastLog: (() => {
      try {
        return JSON.parse(query.data?.data.log?.split("\n")?.at(-2) ?? "{}") as {
          message?: string;
          levelname?: string;
        };
      } catch (e) {
        return {};
      }
    })(),
  };
};

export const useAdviseLogs = (analysis_id?: requestParams["analysis_id"], config?: { [key: string]: unknown }) => {
  const query = useQuery<AxiosResponse<requestResponse>, AxiosError<requestResponse>>({
    ...config,
    queryKey: ["adviseLogs", analysis_id],
    queryFn: () => getAdviseLogs(analysis_id),
  });

  return organizeQuery(query);
};
