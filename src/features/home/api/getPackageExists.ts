import axios from "axios";
import { THOTH_URL } from "config";
import { paths } from "lib/schema";

type path = paths["/python/package/versions"]["get"];
type requestParams = path["parameters"]["query"];
type requestResponseSuccess =
    path["responses"]["200"]["content"]["application/json"];

interface IConfig {
    params: path["parameters"]["query"];
    headers: {
        accept: "application/json";
    };
}

export const getPackageExists = async (name: requestParams["name"]) => {
    const config: IConfig = {
        params: {
            name: name,
        },
        headers: {
            accept: "application/json",
        },
    };
    return axios
        .get<requestResponseSuccess>(
            THOTH_URL + "/python/package/versions",
            config,
        )
        .then(res => {
            return res.data.versions.length > 0;
        })
        .catch(() => false);
};
