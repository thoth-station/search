import axios from "axios";
import { THOTH_URL } from "config";
import { useQuery } from "react-query";

/**
 * An async function that returns a promise for `{base_url}/analyze`
 *
 * @param image the name of the image
 */
export const getImageMetadata = async image => {
    return axios.post(THOTH_URL + "/image/metadata", {}, {
        params: {
            image: image,
        },
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
    });
};

export const useImageMetadata = (image_name, config) => {
    return useQuery({
        ...config,
        enabled: !!image_name,
        queryKey: ["ImageMetadata", image_name],
        queryFn: () => getImageMetadata(image_name),

    });
};
