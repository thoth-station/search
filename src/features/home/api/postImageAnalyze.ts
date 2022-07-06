import axios from "axios";
import { THOTH_URL } from "config";
import { paths } from "../../../lib/schema";

type path = paths["/analyze"]["post"];
type requestParams = path["parameters"]["query"];
type requestResponseSuccess = path["responses"]["202"]["content"]["application/json"];

interface IConfig {
  params: path["parameters"]["query"];
  headers: {
    accept: "application/json";
    "Content-Type": "application/json";
  };
}

export const postImageAnalyze = (image: requestParams["image"]) => {
  const config: IConfig = {
    params: {
      image: image,
    },
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  return axios.post<requestResponseSuccess>(THOTH_URL + "/analyze", {}, config);
};
