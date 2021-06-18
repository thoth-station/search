// React
import React from "react";

// local
import PackageMetrics from "components/Dashboard/PackageMetrics";
import PackageHeader from "components/Dashboard/PackageHeader";
import TabPanel from "components/Shared/TabPanel";

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
  const { state } = location;
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
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
        Item Two
      </TabPanel>
    </div>
  );
};

export default Dashboard;
