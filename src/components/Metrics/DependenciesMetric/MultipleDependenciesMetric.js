// react
import React from "react";
import PropTypes from "prop-types";

// local
import ProgressBar from "components/Shared/ProgressBar";

// material-ui
import { makeStyles } from "@material-ui/core/styles";

import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core/";

const useStyles = makeStyles(theme => ({
  bar: {
    marginBottom: theme.spacing(1)
  },
  header: {
    marginTop: theme.spacing(3)
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
      <Typography variant="body2" className={classes.header} gutterBottom>
        <b>Root Packages</b>
      </Typography>
      <Divider className={classes.bar} />
      <List component="nav">
        {Object.entries(metric.roots).map(([key, value], i) => {
          return (
            <div key={key}>
              <ListItem>
                <ListItemText primary={value.label} />
                <ProgressBar
                  value={metric.roots[key].direct ?? 0}
                  total={totalDependencies}
                  label={"Direct"}
                  className={classes.bar}
                />
                <ProgressBar
                  value={metric.roots[key].indirect ?? 0}
                  total={totalDependencies}
                  label={"Indirect"}
                />
              </ListItem>
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
