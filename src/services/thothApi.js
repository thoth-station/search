import axios from "axios";
import { PYPI, THOTH } from "./CONSTANTS";

// pypi
export const searchForPackage = (name, version) => {
  return axios.get(
    PYPI + "/" + name + (version ? "/" + version : "") + "/json"
  );
};

// thoth
export const thothGetDependencies = (
  name,
  version,
  index = "https://pypi.org/simple"
) => {
  return axios.get(THOTH + "/python/package/dependencies", {
    params: {
      name: name,
      version: version,
      index: index
    },
    headers: {
      accept: "application/json"
    }
  });
};
