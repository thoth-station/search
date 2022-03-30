import axios, { AxiosError, AxiosResponse } from "axios";
import { useQuery } from "react-query";

import { THOTH_URL } from "config";
import { paths } from "lib/schema";

type path = paths["/image/metadata"]["post"];
type requestParams = path["parameters"]["query"];
export type ImageMetadataRequestResponseSuccess =
    path["responses"]["200"]["content"]["application/json"];
export type ImageMetadataRequestResponseFailure =
    path["responses"]["400"]["content"]["application/json"] &
        path["responses"]["403"]["content"]["application/json"];

/**
 * An async function that returns a promise for `{base_url}/analyze`
 *
 * @param image the name of the image
 */
export const getImageMetadata = async (image: requestParams["image"]) => {
    return axios.post(
        THOTH_URL + "/image/metadata",
        {},
        {
            params: {
                image: image,
            },
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
        },
    );
};

export const useImageMetadata = (
    image_name: requestParams["image"],
    config?: { [key: string]: unknown },
) => {
    return useQuery<
        AxiosResponse<ImageMetadataRequestResponseSuccess>,
        AxiosError<ImageMetadataRequestResponseFailure>
    >({
        ...config,
        enabled: !!image_name,
        queryKey: ["ImageMetadata", image_name],
        queryFn: () => getImageMetadata(image_name),
    });
};
