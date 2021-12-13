import axios from "axios";
import { THOTH_URL } from "config";
import { useQuery } from "react-query";

/**
 * An async function that returns a promise for `{base_url}/advise/python`
 *
 * @param analysis_id - the advise document id (ex: `adviser-211112223258-38af1a4746733b53`)
 */
export const getAdviseDocument = async analysis_id => {
    return axios.get(THOTH_URL + "/advise/python/" + analysis_id, {
        headers: {
            accept: "application/json",
        },
    });
};

export const useAdviseDocument = (analysis_id, config) => {
    return useQuery({
        ...config,
        queryKey: ["adviseDocument", analysis_id],
        queryFn: () => getAdviseDocument(analysis_id),
    });
};
