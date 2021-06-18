import axios from "axios";
import { PYPI } from "./CONSTANTS";

export const searchForPackage = query => {
  return axios.get(PYPI + "/" + query + "/json");
};
