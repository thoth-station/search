import axios from "axios";
import { THOTH_URL } from "config";

export const postImageAnalyze = image => {
    return axios.post(
        THOTH_URL + "/analyze",
        {},
        {
            params: {
                image: image,
            },
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
            },
        },
    );
};
