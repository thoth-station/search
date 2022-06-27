import axios from "axios";
import { THOTH_URL } from "config";
import { paths } from "lib/schema";

type path = paths["/advise/python"]["post"];
type requestBody = path["requestBody"]["content"]["application/json"];
type requestResponseSuccess =
    path["responses"]["202"]["content"]["application/json"];

interface IConfig {
    params: path["parameters"]["query"];
    headers: {
        accept: "application/json";
        "Content-Type": "application/json";
    };
}

export const postAdvise = (
    pipfile: requestBody["application_stack"]["requirements"],
    pipfileLock: requestBody["application_stack"]["requirements_lock"],
    runtime_environment: requestBody["runtime_environment"],
) => {
    const config: IConfig = {
        params: {
            recommendation_type: "stable",
        },
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
        },
    };
    const data: path["requestBody"]["content"]["application/json"] = {
        application_stack: {
            requirements: pipfile,
            requirements_format: "pipenv",
            requirements_lock: pipfileLock,
        },
        runtime_environment: runtime_environment,
    };

    return axios.post<requestResponseSuccess>(
        THOTH_URL + "/advise/python",
        data,
        config,
    );
};
