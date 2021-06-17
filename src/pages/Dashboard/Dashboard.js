// React
import React from "react";

// local components
import NetworkGraph from "components/Metrics/DependenciesMetric/NetworkGraph.js";
import InfoCard from "components/InfoCard/InfoCard";

// utils
import { getScaleFreeNetwork } from "utils/getScaleFreeNetwork";

// material-ui
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

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

export const Dashboard = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        {[0, 1, 2, 3].map(i => {
          return (
            <Grid item xs={6} key={i}>
              <InfoCard
                cardMeta={{
                  title: "Title",
                  subTitle: "This is the subTitle"
                }}
                cardBody={<NetworkGraph data={getScaleFreeNetwork(20)} />}
              />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default Dashboard;
