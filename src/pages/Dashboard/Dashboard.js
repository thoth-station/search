// React
import React, { useEffect, useState, useContext } from "react";
import { useParams, useLocation } from "react-router-dom";

// local
import PackageMetrics from "components/Dashboard/PackageMetrics";
import PackageHeader from "components/Dashboard/PackageHeader";
import TabPanel from "components/Shared/TabPanel";
import PackageDependencies from "components/Dashboard/PackageDependencies";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// utils
import {
  useCreateGraph,
  useComputeMetrics,
  useSetRoots
} from "utils/produceMetrics";

// redux
import { StateContext } from "App";

// material-ui
import { makeStyles } from "@material-ui/core/styles";
import { Tab, Tabs, Typography } from "@material-ui/core";

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
export const Dashboard = ({ location }) => {
  const classes = useStyles();
  const params = useParams();
  const state = useContext(StateContext);
  const search = useLocation().search;

  // for tab control
  const [value, setValue] = useState(0);

  const [starts, setStarts] = useState(null);
  // after render
  useEffect(() => {
    const query = new URLSearchParams(search);

    const packages = query.get("packages")?.split(",");

    // parse packages into object list
    let s = packages?.map(p => {
      return {
        name: p,
        version: undefined
      };
    });

    // if not muliple packages, then reset to the params
    s = s ?? [
      {
        name: params.package,
        version: params?.version
      }
    ];

    setStarts(s);
  }, [params.package, params.version, search]);

  // custom hooks
  useSetRoots(starts);
  useCreateGraph(state.roots, 2);
  useComputeMetrics(state.roots, state.graph);

  // handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <LoadingErrorTemplate
      state={state.packageError ? "error" : state.roots}
      show404={"Package"}
    >
      <div className={classes.root}>
        {state?.roots?.length === 1 ? <PackageHeader /> : null}
        {state?.roots?.map(r => {
          if (r.error) {
            return (
              <Typography color="error" gutterBottom variant="body2">
                {r.error}
              </Typography>
            );
          }
          return null;
        })}
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
