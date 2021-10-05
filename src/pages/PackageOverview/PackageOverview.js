// React
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

// local
import PackageHeader from "components/package/PackageHeader";

// api
import { thothSearchForPackage, searchForPackage } from "services/thothApi";
import compareVersions from "tiny-version-compare";

// redux
import { DispatchContext } from "App";

// material-ui
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// component styling
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: "95%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    marginTop: theme.spacing(4)
  }
}));

// The page that displays all analyis data
export const PackageOverview = ({ location }) => {
  const classes = useStyles();
  const params = useParams();
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    searchForPackage(params.package_name, params.package_version).then(
      response => {
        var pypi_data = response.data;

        // get versions
        var package_data = {
          latest_version: pypi_data.info.version,
          all_versions: {}
        };
        Object.entries(pypi_data.releases).forEach(([k, v]) => {
          if (
            compareVersions(package_data.latest_version, k) === -1 &&
            !v?.[0]?.yanked
          ) {
            package_data.latest_version = k;
          }
          package_data.all_versions[k] = {
            date: v?.[0]?.upload_time,
            yanked: v?.[0]?.yanked
          };
        });

        // get thoth data of package
        thothSearchForPackage(
          params.package_name,
          params.package_version ?? package_data.latest_version
        )
          .then(response => {
            dispatch({
              type: "package",
              payload: {
                ...package_data,
                ...response.data.metadata,
                isThoth: true
              }
            });
          })
          .catch(e => {
            dispatch({
              type: "package",
              payload: {
                ...package_data,
                ...pypi_data.info,
                isThoth: false
              }
            });
          });
      }
    );
  }, [dispatch, params.package_name, params.package_version]);

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12}>
        <PackageHeader />
      </Grid>
    </Grid>
  );
};

export default PackageOverview;
