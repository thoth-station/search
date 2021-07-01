import axios from "axios";
import { PYPI, THOTH } from "./CONSTANTS";
import compareVersions from "tiny-version-compare";

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
    timeout: 5000,
    headers: {
      accept: "application/json"
    }
  });
};

export const thothGetLatestVersion = (name, version) => {
  return axios
    .get(THOTH + "/python/package/versions", {
      params: {
        name: name
      },
      timeout: 5000,
      headers: {
        accept: "application/json"
      }
    })
    .then(res => {
      if (res.data.versions.length === 0) {
        return null;
      } else {
        const sorted = res.data.versions.sort(function(a, b) {
          return compareVersions(a.package_version, b.package_version);
        });

        // compare to version if supplied
        if (version && sorted.includes(version)) {
          return version;
        }

        return sorted[sorted.length - 1].package_version;
      }
    })
    .catch(() => {
      return null;
    });
};
