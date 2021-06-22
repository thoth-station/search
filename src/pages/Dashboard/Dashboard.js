// React
import React, { useEffect, useState } from "react";

// local
import PackageMetrics from "components/Dashboard/PackageMetrics";
import PackageHeader from "components/Dashboard/PackageHeader";
import TabPanel from "components/Shared/TabPanel";
import PackageDependencies from "components/Dashboard/PackageDependencies";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// API
import { searchForPackage } from "services/thothApi";

// material-ui
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { useParams } from "react-router-dom";

// component styling
const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    maxWidth: "1440px",
    marginLeft: "auto",
    marginRight: "auto",
    paddingRight: theme.spacing(3),
    paddingLeft: theme.spacing(3),
    marginTop: theme.spacing(4)
  }
}));

export const Dashboard = ({ location }) => {
  const classes = useStyles();
  const params = useParams();
  const [state, setState] = useState(location.state);
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    // if user doesnt directly navigate then get the package
    // if the package or version doesnt exists, act accordingly
    if (!state) {
      searchForPackage(params?.package, params?.version)
        .then(r => {
          setState(r.data);
        })
        .catch(e => {
          // does not exist
          setState("error");
        });
    }
  }, [state, params]);

  // handle tab chnage
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <LoadingErrorTemplate
      state={
        state === undefined
          ? "loading"
          : state === "error"
          ? "error"
          : undefined // if state is populated
      }
    >
      <div className={classes.root}>
        <PackageHeader data={state} />
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
          <PackageDependencies data={state} />
        </TabPanel>
      </div>
    </LoadingErrorTemplate>
  );
};

export default Dashboard;
