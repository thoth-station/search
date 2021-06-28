// React
import React, { useEffect, useState, useReducer } from "react";
import { useParams } from "react-router-dom";

// local
import PackageMetrics from "components/Dashboard/PackageMetrics";
import PackageHeader from "components/Dashboard/PackageHeader";
import TabPanel from "components/Shared/TabPanel";
import PackageDependencies from "components/Dashboard/PackageDependencies";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// API
import { searchForPackage, thothCompareLatestVersion } from "services/thothApi";

// utils
import {
  produceDeepMetrics,
  produceShallowMetrics
} from "utils/produceMetrics";

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

function reducer(state, action) {
  switch (action.type) {
    case "metadata":
      return { ...state, metadata: action.payload };
    case "graph":
      return { ...state, graph: action.payload };
    case "metric":
      return {
        ...state,
        metrics: { ...state.metrics, [action.metricName]: action.payload }
      };
    case "metric-field":
      return {
        ...state,
        metrics: {
          ...state.metrics,
          [action.metricName]: {
            ...state.metrics[action.metricName],
            [action.fieldName]: action.payload
          }
        }
      };
    case "warning": {
      return {
        ...state,
        warning: action.payload
      };
    }
    case "error": {
      return {
        ...state,
        error: { [action.who]: action.payload }
      };
    }

    default:
      return state;
  }
}

// The page that displays all analyis data
export const Dashboard = ({ location }) => {
  const classes = useStyles();
  const params = useParams();

  // for state control
  const [state, dispatch] = useReducer(reducer, {
    metadata: undefined,
    graph: undefined,
    metrics: {},
    error: {
      graph: false,
      metadata: false
    }
  });

  // for tab control
  const [value, setValue] = useState(0);

  // before render
  useEffect(() => {
    // if the package or version doesnt exists, act accordingly
    searchForPackage(params?.package, params?.version)
      .then(r => {
        // check if thoth is up to data for package
        thothCompareLatestVersion(r.data.info.name).then(v => {
          if (v !== r.data.info.version) {
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
          }
        });

        // set root/parent package metdata for shallow analyis
        dispatch({ type: "metadata", payload: r.data });
        applyMetrics(produceShallowMetrics(r.data).metrics);

        // preform deep analysis in the background, update state when finished
        produceDeepMetrics(r.data, 3)
          .then(deepMetrics => {
            // set graph data and metrics to state
            dispatch({ type: "graph", payload: deepMetrics.graph });
            applyMetrics(deepMetrics.metrics);
          })
          .catch(e => {
            dispatch({
              type: "error",
              who: "graph",
              payload: true
            });
          });
      })
      .catch(e => {
        // does not exist
        dispatch({ type: "error", who: "metadata", payload: true });
      });
  }, [params]);

  // component specific functions //

  // applsy all metrics to state q
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
