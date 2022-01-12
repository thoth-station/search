import axios from "axios";
import { THOTH_URL } from "config";

export const getPackageExists = async (name) => {
    return axios.get(THOTH_URL + "/python/package/versions", {
        params: {
            name: name,
            per_page: 1
        },
        headers: {
            accept: "application/json",
        },
    }).then(res => {
        return res.data.versions.length > 0;
    }).catch(() => false);
};
