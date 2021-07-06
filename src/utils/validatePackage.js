// API
import { searchForPackage, thothGetLatestVersion } from "services/thothApi";

// utils
import compareVersions from "tiny-version-compare";

// return null if no packages
// return metadata if package exists
// return metadata of requested package
// 		and thoth latest version and error
//		if thoth not up to date or n/a
export async function validatePackage(name, version) {
  //if the package or version doesnt exists, then get it
  return await searchForPackage(name, version)
    .then(async r => {
      // check if thoth is up to data for package
      return await thothGetLatestVersion(name, version)
        .then(v => {
          // if thoth does not have any refrence to package
          if (v === null) {
            return {
              metadata: r.data,
              error:
                "Thoth currently does not support '" + r.data.info.name + "'."
            };
          }
          // thoth does not have the latest but has a version
          else if (compareVersions(r.data.info.version, v) > 0) {
            return {
              metadata: r.data,
              thothVersion: v,
              error:
                "Thoth currently supports '" +
                r.data.info.name +
                "' up to version " +
                v +
                ", while the most recent version of '" +
                r.data.info.name +
                "' is " +
                r.data.info.version +
                "."
            };
          }
          // thoth is up to date with the version
          else {
            return {
              metadata: r.data
            };
          }
        })
        .catch(() => {
          // thoth ran into an error unlreated to the package
          return null;
        });
    })
    .catch(() => {
      // package does not exist
      return null;
    });
}
