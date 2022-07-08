import axios, { AxiosError, AxiosResponse } from "axios";
import { THOTH_URL } from "config";
import { useQuery } from "react-query";
import { paths } from "lib/schema";

type path = paths["/advise/python/{analysis_id}/log"]["get"];
type requestParams = path["parameters"]["path"];
type requestResponseSuccess = path["responses"]["200"]["content"]["application/json"];
type requestResponseFailure = path["responses"]["400"]["content"]["application/json"] &
  path["responses"]["404"]["content"]["application/json"];
/**
 * An async function that returns a promise for `{base_url}/advise/python/logs`
 *
 * @param analysis_id - the advise document id (ex: `adviser-211112223258-38af1a4746733b53`)
 */
export const getAdviseLogs = async (analysis_id?: requestParams["analysis_id"]) => {
  return axios.get<requestResponseSuccess>(THOTH_URL + "/advise/python/" + analysis_id + "/log", {
    headers: {
      accept: "application/json",
    },
  });
};

export const useAdviseLogs = (analysis_id?: requestParams["analysis_id"], config?: { [key: string]: unknown }) => {
  return useQuery<AxiosResponse<requestResponseSuccess>, AxiosError<requestResponseFailure>>({
    ...config,
    queryKey: ["adviseLogs", analysis_id],
    queryFn: () => getAdviseLogs(analysis_id),
  });
};
