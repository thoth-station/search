// react
import React from "react";
import PropTypes from "prop-types";

// local
import ProgressBar from "components/Shared/ProgressBar";

// material-ui
import { makeStyles } from "@material-ui/styles";

import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid
} from "@material-ui/core/";

const useStyles = makeStyles(theme => ({
  bar: {
    marginBottom: theme.spacing(1)
  }
}));

const MultipleDependenciesMetric = ({ metric }) => {
  const classes = useStyles();
  const totalDependencies =
    (metric.all.direct ?? 0) +
    (metric.all.indirect ?? 0) +
    (metric.all.roots ?? 0);

  return (
    <div>
      <Typography variant="body2" gutterBottom>
        <b>All Packages</b>
      </Typography>
      <Divider className={classes.bar} />
      <ProgressBar
        value={metric.all.roots ?? 0}
        total={totalDependencies}
        label={"Root"}
        className={classes.bar}
      />
      <ProgressBar
        value={metric.all.direct ?? 0}
        total={totalDependencies}
        label={"Direct"}
        className={classes.bar}
      />
      <ProgressBar
        value={metric.all.indirect ?? 0}
        total={totalDependencies}
        label={"Indirect"}
      />
      <Typography variant="body2" gutterBottom mt={2}>
        <b>Root Packages</b>
      </Typography>
      <Divider className={classes.bar} />
      <List component="nav">
        {Object.entries(metric.roots).map(([key, value], i) => {
          const t =
            (metric.roots[key].direct ?? 0) + (metric.roots[key].indirect ?? 0);
          return (
            <div key={key}>
              <ListItem>
                <Grid container alignItems="center">
                  <Grid item xs>
                    <ListItemText primary={key} />
                  </Grid>
                  <Grid item xs>
                    <Grid container direction="column">
                      <Grid item xs>
                        <ProgressBar
                          value={metric.roots[key].direct ?? 0}
                          total={t}
                          label={"Direct"}
                        />
                      </Grid>
                      <Grid item xs>
                        <ProgressBar
                          value={metric.roots[key].indirect ?? 0}
                          total={t}
                          label={"Indirect"}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider variant={"middle"} className={classes.bar} />
            </div>
          );
        })}
      </List>
    </div>
  );
};

MultipleDependenciesMetric.propTypes = {
  metric: PropTypes.shape({
    all: PropTypes.shape({
      direct: PropTypes.number,
      indirect: PropTypes.number,
      roots: PropTypes.number
    })
  })
};

export default MultipleDependenciesMetric;
