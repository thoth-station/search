// React
import React, { useState, useContext, useEffect } from "react";
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
import { thothAdviseResult, thothAdviseStatus } from "services/thothApi";

// redux
import { StateContext, DispatchContext } from "App";

// material-ui
import { makeStyles } from "@material-ui/styles";
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

  // delay for each status api call
  const [pollingTime, setPollingTime] = useState(null);

  useEffect(() => {
    // only run if polling is turned off (meaning the result is ready)
    if (pollingTime !== null) {
      return;
    }

    // get results of advise request
    thothAdviseResult(params.analysis_id).then(response => {
      const data = response.data;

      // if cant run advise error
      if (response.status === 400 || response.status === 404) {
        // set error and stop polling
        dispatch({
          type: "advise",
          param: "error",
          payload: data.error
        });
      }
      // if advise report not ready
      else if (response.status === 202) {
        setPollingTime(500);
      }
      // if done then set results and stop polling
      // note this could also have an error but should of been stopped above
      else if (response.status === 200) {
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
      }
      // if an unknown response occured
      else {
        dispatch({
          type: "advise",
          param: "error",
          payload: "Unknown Error: Aborting"
        });
      }
    });
  }, [params.analysis_id, dispatch, pollingTime]);

  useInterval(() => {
    thothAdviseStatus(params.analysis_id).then(response => {
      // set next polling delay
      const status = response.data;

      dispatch({
        type: "advise",
        param: "status",
        payload: status
      });

      // check if advise is done
      // if done then turn off polling whcih triggers another call for results
      if (status.finished_at === null) {
        setPollingTime(null);
      } else {
        setPollingTime(
          pollingTime !== null ? Math.min(pollingTime * 2, 8000) : null
        );
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
