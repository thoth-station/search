// React
import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";

// local
import PackageMetrics from "components/Dashboard/PackageMetrics";
import PackageHeader from "components/Dashboard/PackageHeader";
import TabPanel from "components/Shared/TabPanel";
import PackageDependencies from "components/Dashboard/PackageDependencies";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// API
import { searchForPackage, thothGetLatestVersion } from "services/thothApi";

// utils
import {
  produceDeepMetrics,
  produceShallowMetrics,
  createGraph
} from "utils/produceMetrics";
import compareVersions from "tiny-version-compare";

// redux
import { DispatchContext, StateContext } from "App";

// material-ui
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// The page that displays all analyis data
export const Dashboard = ({ location }) => {
  const classes = useStyles();
  const params = useParams();
  const query = useQuery();
  const packages = query.get("packages")?.split(",");

  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);

  // for tab control
  const [value, setValue] = useState(0);

  // before render
  useEffect(() => {
    // applys all metrics to state
    const applyMetrics = metrics => {
      for (const metricName of Object.keys(metrics)) {
        // for each field on metric
        for (const [field, payload] of Object.entries(metrics[metricName])) {
          // add metrics to state.
          dispatch({
            type: "metric-field",
            fieldName: field,
            metricName: metricName,
            payload: payload
          });
        }
      }
    };

    //if the package or version doesnt exists, then get it
    searchForPackage(params?.package, params?.version).then(r => {
      // check if thoth is up to data for package
      thothGetLatestVersion(r.data.info.name).then(v => {
        if (v === null || compareVersions(r.data.info.version, v) > 0) {
          dispatch({
            type: "warning",
            payload: v
              ? "Thoth currently supports up to version " +
                v +
                ", while the most recent version is " +
                r.data.info.version +
                "."
              : "Thoth currently does not support this package."
          });
        } else {
          createGraph(r.data, 1).then(g => {
            console.log(g);
          });
        }
      });

      // set root/parent package metdata for shallow analyis
      //dispatch({ type: "metadata", payload: r.data });
      //applyMetrics(produceShallowMetrics(r.data).metrics);

      // preform deep analysis in the background, update state when finished
      //   produceDeepMetrics(r.data, 2)
      //     .then(deepMetrics => {
      //       // set graph data and metrics to state
      //       dispatch({ type: "graph", payload: deepMetrics.graph });
      //       applyMetrics(deepMetrics.metrics);
      //     })
      //     .catch(e => {
      //       dispatch({
      //         type: "error",
      //         who: "graph",
      //         payload: true
      //       });
      //     });
      // })
      // .catch(e => {
      //   // does not exist
      //   dispatch({ type: "error", who: "metadata", payload: true });
    });
  }, [dispatch, params.package, params.version]);

  // component specific functions //

  // handle tab chnage
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <LoadingErrorTemplate
      state={state.error.metadata ? "error" : state.metadata}
      show404={"Package"}
    >
      <div className={classes.root}>
        <PackageHeader data={state.metadata} warning={state.warning} />
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Overview" />
          <Tab label="Dependencies" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <PackageMetrics state={state} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PackageDependencies state={state} />
        </TabPanel>
      </div>
    </LoadingErrorTemplate>
  );
};

export default Dashboard;
