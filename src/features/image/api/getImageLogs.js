import axios from "axios";
import { THOTH_URL } from "config";
import { useQuery } from "react-query";

/**
 * An async function that returns a promise for `{base_url}/image/logs`
 *
 * @param analysis_id - the image document id (ex: `package-extract-211112223258-38af1a4746733b53`)
 */
export const getImageLogs = async analysis_id => {
    return axios.get(THOTH_URL + "/analyze/" + analysis_id + "/log", {
        headers: {
            accept: "application/json",
        },
    });
};

export const useImageLogs = (analysis_id, config) => {
    return useQuery({
        ...config,
        queryKey: ["ImageLogs", analysis_id],
        queryFn: () => getImageLogs(analysis_id),
    });
};
