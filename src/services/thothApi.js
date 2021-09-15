import axios from "axios";
import { PYPI, THOTH, LICENSES } from "./CONSTANTS";
import { cacheGet, cacheSet } from "./apiCache";
import compareVersions from "tiny-version-compare";

// GitHub
export function getGitHubFileText(githubRepo, fileName) {
  const url = new URL(githubRepo);

  if (url.hostname === "github.com") {
    return fetch(
      "https://raw.githubusercontent.com" + url.pathname + "/master/" + fileName
    )
      .then(response => response.text())
      .then(response => {
        return response;
      });
  } else return Promise.reject();
}

export function getFile(url) {
  return fetch(url)
    .then(response => response.text())
    .then(response => {
      return response;
    });
}

export function getLicenses() {
  return getFile(LICENSES).then(text => JSON.parse(text));
}

// pypi
export const searchForPackage = (name, version) => {
  return axios.get(
    PYPI + "/" + name + (version ? "/" + version : "") + "/json"
  );
};

export const thothSearchForPackage = (
  name,
  version,
  index = "https://pypi.org/simple"
) => {
  // grab from cache if available
  const cache = cacheGet("metadata", name + version);
  if (cache) {
    return Promise.resolve(cache);
  }

  return axios
    .get(THOTH + "/python/package/metadata", {
      params: {
        name: name,
        version: version,
        index: index
      },
      headers: {
        accept: "application/json"
      }
    })
    .then(res => {
      cacheSet("metadata", name + version, res.data.metadata);
      return res.data.metadata;
    })
    .catch(e => {
      if (e?.response?.status === 404 || e?.isAxiosError) {
        return axios
          .get(PYPI + "/" + name + (version ? "/" + version : "") + "/json")
          .then(res => {
            return res.data.info;
          });
      } else {
        throw e;
      }
    });
};

// thoth
export const thothAdvise = (pipfile, pipfileLock) => {
  const d = {
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
      python_version: "3.6"
    }
  };

  return axios.post(THOTH + "/advise/python", d, {
    params: {
      recommendation_type: "stable",
      force: true
    },
    headers: {
      accept: "application/json"
    }
  });
};

export const thothAdviseResult = analysis_id => {
  // grab from cache if available
  const cache = cacheGet("adviseResult", analysis_id);
  if (cache) {
    return Promise.resolve(cache);
  }

  return axios
    .get(THOTH + "/advise/python/" + analysis_id, {
      headers: {
        accept: "application/json"
      }
    })
    .then(response => {
      cacheSet("adviseResult", analysis_id, response);
      return response;
    });
};

export const thothAdviseStatus = analysis_id => {
  return axios.get(THOTH + "/advise/python/" + analysis_id + "/status", {
    headers: {
      accept: "application/json"
    }
  });
};

export const thothGetDependencies = (
  name,
  version,
  index = "https://pypi.org/simple"
) => {
  // grab from cache if available
  const cache = cacheGet("dependencies", name + version);
  if (cache) {
    return Promise.resolve(cache);
  }

  return axios
    .get(THOTH + "/python/package/dependencies", {
      params: {
        name: name,
        version: version,
        index: index
      },
      //timeout: 5000,
      headers: {
        accept: "application/json"
      }
    })
    .then(response => {
      cacheSet("dependencies", name + version, response);
      return response;
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
