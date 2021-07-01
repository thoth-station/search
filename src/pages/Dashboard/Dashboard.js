// React
import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useHistory } from "react-router-dom";

// local
import PackageMetrics from "components/Dashboard/PackageMetrics";
import PackageHeader from "components/Dashboard/PackageHeader";
import TabPanel from "components/Shared/TabPanel";
import PackageDependencies from "components/Dashboard/PackageDependencies";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// navigation
import { ROOT } from "navigation/CONSTANTS";

// utils
import { useCreateGraph, useComputeMetrics } from "utils/produceMetrics";
import { validatePackage } from "utils/validatePackage";

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
  const history = useHistory();
  const classes = useStyles();
  const params = useParams();
  const query = useQuery();
  const packages = query.get("packages")?.split(",");

  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);

  // for tab control
  const [value, setValue] = useState(0);

  // after render
  useEffect(() => {
    // parse packages into object list
    let starts = packages?.map(p => {
      return {
        package: p,
        version: undefined
      };
    });

    // if not muliple packages, then reset to the params
    starts = starts ?? [
      {
        name: params.package,
        version: params?.version
      }
    ];

    // for each package (could be one) validate
    const roots = starts.map(async start => {
      return validatePackage(start.name, start?.version);
    });

    Promise.all(roots).then(roots => {
      dispatch({
        type: "roots",
        payload: roots
      });
    });
  }, [dispatch, params.package, params.version, packages, history]);

  useCreateGraph(state.roots, 2);

  useComputeMetrics(state.roots, state.graph);

  // handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <LoadingErrorTemplate
      state={state.error ? "error" : state.roots}
      show404={"Package"}
    >
      <div className={classes.root}>
        <PackageHeader />
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
          <PackageMetrics />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <PackageDependencies />
        </TabPanel>
      </div>
    </LoadingErrorTemplate>
  );
};

export default Dashboard;
