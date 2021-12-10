import axios from "axios";
import { THOTH_URL } from "config";
import { useQuery } from "react-query";

/**
 * An async function that returns a promise for `{base_url}/advise/python/logs`
 *
 * @param analysis_id - the advise document id (ex: `adviser-211112223258-38af1a4746733b53`)
 */
export const getAdviseLogs = async analysis_id => {
    return axios.get(THOTH_URL + "/advise/python/" + analysis_id + "/log", {
        headers: {
            accept: "application/json",
        },
    });
};

export const useAdviseLogs = (analysis_id, config) => {
    return useQuery({
        ...config,
        queryKey: ["adviseLogs", analysis_id],
        queryFn: () => getAdviseLogs(analysis_id),
    });
};
