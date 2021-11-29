import axios from "axios";
import {THOTH_URL} from "config"


export const postAdvise = (pipfile, pipfileLock) => {
    const data = {
        application_stack: {
            requirements: pipfile,
            requirements_format: "pipenv",
            requirements_lock: pipfileLock
        },
        runtime_environment: {
            operating_system: {
                name: "ubi",
                version: "8"
            },
            platform: "linux-x86_64",
            python_version: "3.9"
        }
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