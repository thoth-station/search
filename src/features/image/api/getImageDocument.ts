import axios, { AxiosResponse, AxiosError } from "axios";
import { useQuery } from "react-query";

import { paths } from "lib/schema";
import { THOTH_URL } from "config";

type path = paths["/analyze/{analysis_id}"]["get"];
type requestParams = path["parameters"]["path"];
export type ImageDocumentRequestResponseSuccess =
    path["responses"]["200"]["content"]["application/json"] &
        path["responses"]["202"]["content"]["application/json"];
export type ImageDocumentRequestResponseFailure =
    path["responses"]["400"]["content"]["application/json"] &
        path["responses"]["404"]["content"]["application/json"];

/**
 * An async function that returns a promise for `{base_url}/analyze`
 *
 * @param analysis_id - the image document id (ex: `package-extract-211112223258-38af1a4746733b53`)
 */
export const getImageDocument = async (
    analysis_id?: requestParams["analysis_id"],
) => {
    return axios.get<ImageDocumentRequestResponseSuccess>(
        THOTH_URL + "/analyze/" + analysis_id,
        {
            headers: {
                accept: "application/json",
            },
        },
    );
};

export const useImageDocument = (
    analysis_id?: requestParams["analysis_id"],
    config?: { [key: string]: unknown },
) => {
    return useQuery<
        AxiosResponse<ImageDocumentRequestResponseSuccess>,
        AxiosError<ImageDocumentRequestResponseFailure>
    >({
        ...config,
        enabled: !!analysis_id,
        queryKey: ["ImageDocument", analysis_id],
        queryFn: () => getImageDocument(analysis_id),
    });
};
