import axios from "axios";
import {THOTH_URL,} from "config"
import {useQuery} from 'react-query';

export const getAdviseDocument = (analysis_id) => {
    return axios
        .get(THOTH_URL + "/advise/python/" + analysis_id, {
            headers: {
                accept: "application/json"
            }
        })
};

export const useAdviseDocument = (analysis_id, config) => {
    return useQuery({
        ...config,
        queryKey: ['adviseDocument', analysis_id],
        queryFn: () => getAdviseDocument(analysis_id),
    });
};
