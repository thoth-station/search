import axios from "axios";
import {THOTH_URL} from "config"


export const postAdvise = (pipfile, pipfileLock, runtime_environment) => {
    const data = {
        application_stack: {
            requirements: pipfile,
            requirements_format: "pipenv",
            requirements_lock: pipfileLock
        },
        runtime_environment: runtime_environment
    };

    return axios.post(THOTH_URL + "/advise/python", data, {
        params: {
            recommendation_type: "stable",
            force: true
        },
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        }
    });
};