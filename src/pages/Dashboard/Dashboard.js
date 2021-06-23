// React
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// local
import PackageMetrics from "components/Dashboard/PackageMetrics";
import PackageHeader from "components/Dashboard/PackageHeader";
import TabPanel from "components/Shared/TabPanel";
import PackageDependencies from "components/Dashboard/PackageDependencies";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// API
import { searchForPackage } from "services/thothApi";

// utils
import { produceMetrics } from "utils/produceMetrics";

// material-ui
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

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
  const [metadata, setMetadata] = useState(undefined);
  const [graphData, setGraphData] = useState(undefined);
  const [value, setValue] = useState(0);

  useEffect(() => {
    // if the package or version doesnt exists, act accordingly
    searchForPackage(params?.package, params?.version)
      .then(r => {
        setMetadata(r.data);
        produceMetrics(r.data).then(state => {
          setGraphData(state.graphData);
        });
      })
      .catch(e => {
        // does not exist
        setMetadata("error");
      });
  }, [params]);

  // handle tab chnage
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <LoadingErrorTemplate
      state={
        metadata === undefined
          ? "loading"
          : metadata === "error"
          ? "error"
          : undefined // if state is populated
      }
    >
      <div className={classes.root}>
        <PackageHeader data={metadata} />
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
          <PackageDependencies graphData={graphData} metadata={metadata} />
        </TabPanel>
      </div>
    </LoadingErrorTemplate>
  );
};

export default Dashboard;
