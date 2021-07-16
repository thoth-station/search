// React
import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";

// local
import PackageMetrics from "components/Dashboard/PackageMetrics";
import PackageHeader from "components/Dashboard/PackageHeader";
import AdviseHeader from "components/Dashboard/AdviseHeader";

import TabPanel from "components/Shared/TabPanel";
import PackageDependencies from "components/Dashboard/PackageDependencies";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// utils
import { useComputeMetrics, useLockFileToGraph } from "utils/produceMetrics";
import { useInterval } from "utils/useInterval";

// api
import { thothAdviseResult } from "services/thothApi";

// redux
import { StateContext, DispatchContext } from "App";

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
  const dispatch = useContext(DispatchContext);

  // for tab control
  const [value, setValue] = useState(0);

  const [pollingTime, setPollingTime] = useState(500);

  useInterval(() => {
    thothAdviseResult(params.analysis_id).then(response => {
      // set next polling delay
      setPollingTime(
        pollingTime !== null ? Math.min(pollingTime * 2, 8000) : null
      );

      const data = response.data;
      console.log(data);

      // if cant run advise error
      if (data.error) {
        // set error and stop polling
        dispatch({
          type: "advise",
          param: "error",
          payload: data.error
        });
        dispatch({
          type: "advise",
          param: "failed",
          payload: response.status
        });
        setPollingTime(null);
      }
      // if advise report not ready
      else if (data.status) {
        dispatch({
          type: "advise",
          param: "status",
          payload: data.status
        });
      }
      // if done then set results and stop polling
      // note this could also have an error but should of been stopped above
      else if (data.result) {
        if (data.result?.error) {
          dispatch({
            type: "advise",
            param: "error",
            payload: data.result.error_msg
          });
        }
        dispatch({
          type: "advise",
          param: "pipfile",
          payload: Object.keys(
            data.result.parameters.project.requirements.packages
          )
        });
        dispatch({
          type: "advise",
          param: "pipfileLock",
          payload: data.result.parameters.project.requirements_locked.default
        });
        dispatch({
          type: "advise",
          param: "report",
          payload: data.result.report
        });
        dispatch({
          type: "advise",
          param: "metadata",
          payload: data.metadata
        });

        setPollingTime(null);
      }
      // if an unknown response occured
      else {
        dispatch({
          type: "advise",
          param: "error",
          payload: "Unknown Error: Aborting"
        });
        setPollingTime(null);
      }
    });
  }, pollingTime);
  useLockFileToGraph(state?.advise?.pipfile, state?.advise?.pipfileLock);
  useComputeMetrics(state?.advise?.pipfile, state.graph);

  console.log(state);

  // handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //       isError={state?.advise?.error !== undefined}

  return (
    <LoadingErrorTemplate
      isLoading={state?.advise?.report === undefined}
      errorText={state?.advise?.error}
    >
      <div className={classes.root}>
        {state?.focus ? (
          <PackageHeader />
        ) : (
          <AdviseHeader adviseID={params.analysis_id} />
        )}
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
