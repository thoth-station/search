import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";

import { THOTH_URL } from "config";
import { paths } from "lib/schema";

type path = paths["/analyze/{analysis_id}/log"]["get"];
type requestParams = path["parameters"]["path"];
type requestResponseSuccess =
    path["responses"]["200"]["content"]["application/json"];
type requestResponseFailure =
    path["responses"]["400"]["content"]["application/json"] &
        path["responses"]["404"]["content"]["application/json"];

/**
 * An async function that returns a promise for `{base_url}/image/logs`
 *
 * @param analysis_id - the image document id (ex: `package-extract-211112223258-38af1a4746733b53`)
 */
export const getImageLogs = async (
    analysis_id?: requestParams["analysis_id"],
) => {
    return axios.get(THOTH_URL + "/analyze/" + analysis_id + "/log", {
        headers: {
            accept: "application/json",
        },
    });
};

export const useImageLogs = (
    analysis_id?: requestParams["analysis_id"],
    config?: { [key: string]: unknown },
) => {
    return useQuery<
        AxiosResponse<requestResponseSuccess>,
        AxiosError<requestResponseFailure>
    >({
        ...config,
        enabled: !!analysis_id,
        queryKey: ["ImageLogs", analysis_id],
        queryFn: () => getImageLogs(analysis_id),
    });
};
