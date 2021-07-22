// React
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";

// local
import MetricLayout from "components/Dashboard/Summary/MetricLayout";
import PackageHeader from "components/Dashboard/Summary/PackageHeader";
import AdviseHeader from "components/Dashboard/Summary/AdviseHeader";

import TabPanel from "components/Shared/TabPanel";
import AdvisePage from "components/Dashboard/Advise/AdvisePage";

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

  const getStatus = () => {
    thothAdviseStatus(params.analysis_id).then(response => {
      // set next polling delay
      const status = response.data.status;

      dispatch({
        type: "advise",
        param: "status",
        payload: status
      });

      // check if advise is done
      // if done then turn off polling whcih triggers another call for results
      if (status.finished_at !== null) {
        setPollingTime(null);
      } else {
        setPollingTime(
          pollingTime !== null ? Math.min(pollingTime * 2, 8000) : null
        );
      }
    });
  };

  // first reset state if using new anyalysis id
  useEffect(() => {
    if (!state?.analysis_id || params.analysis_id !== state?.analysis_id) {
      dispatch({
        type: "reset"
      });
      dispatch({
        type: "advise",
        param: "analysis_id",
        payload: params.analysis_id
      });
    }
  }, [params.analysis_id, state?.analysis_id, dispatch]);

  // fetch results of advise
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
        setPollingTime(null);
        dispatch({
          type: "advise",
          param: "error",
          payload: data.error
        });
      }

      // if not done then start polling
      else if (response.status === 202) {
        if (response.data.status.state === "error") {
          dispatch({
            type: "advise",
            param: "status",
            payload: response.data.status
          });
        } else {
          setPollingTime(500);
        }
      }

      // if done then set results and stop polling
      // note this could also have an error but should of been stopped above
      else if (response.status === 200) {
        // stop polling when done
        setPollingTime(null);

        if (data.result?.error) {
          dispatch({
            type: "advise",
            param: "error",
            payload: data.result.error_msg
          });
        }
        dispatch({
          type: "advise",
          param: "initProject",
          payload: data.result.parameters.project
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
    getStatus();
  }, pollingTime);

  // create graphs
  useLockFileToGraph(
    state?.advise?.report?.products?.[0]?.project?.requirements?.packages,
    state?.advise?.report?.products?.[0]?.project?.requirements_locked?.default,
    "adviseGraph"
  );
  useLockFileToGraph(
    state?.advise?.initProject?.requirements?.packages,
    state?.advise?.initProject?.requirements_locked?.default,
    "initGraph"
  );
  useComputeMetrics(
    state.adviseGraph,
    state?.advise?.report?.products?.[0]?.project?.requirements?.packages
  );

  console.log(state);

  // handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
      <Typography color="error">{state?.error}</Typography>
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
        <MetricLayout />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AdvisePage />
      </TabPanel>
    </div>
  );
};

export default Dashboard;
