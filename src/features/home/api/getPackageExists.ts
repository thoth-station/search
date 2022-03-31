import axios from "axios";
import { THOTH_URL } from "config";
import { paths } from "lib/schema";

type path = paths["/python/package/versions"]["get"];
type requestParams = path["parameters"]["query"];
type requestResponseSuccess =
    path["responses"]["200"]["content"]["application/json"];

export const getPackageExists = async (name: requestParams["name"]) => {
    return axios
        .get<requestResponseSuccess>(THOTH_URL + "/python/package/versions", {
            params: {
                name: name,
                per_page: 1,
            },
            headers: {
                accept: "application/json",
            },
        })
        .then(res => {
            return res.data.versions.length > 0;
        })
        .catch(() => false);
};
