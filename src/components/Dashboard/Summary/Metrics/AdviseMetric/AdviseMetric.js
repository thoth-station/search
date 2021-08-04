// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Typography, Divider } from "@material-ui/core";

// local
import ProgressBar from "components/Shared/ProgressBar";

const useStyles = makeStyles(theme => ({
  bar: {
    marginBottom: theme.spacing(1)
  },
  header: {
    marginTop: theme.spacing(3)
  },
  flex: {
    display: "flex",
    flexDirection: "column"
  }
}));

const AdviseMetric = ({ metric }) => {
  const classes = useStyles();
  const total =
    metric.added + metric.removed + metric.version + metric.unchanged;
  return (
    <div>
      <Typography variant="body2" gutterBottom>
        {metric.build}
      </Typography>
      <Typography variant="body2" gutterBottom mt={2}>
        <b>
          Differences between the old Pipfile.lock and Thoth's new Pipfile.lock
        </b>
      </Typography>
      <Divider className={classes.bar} />
      <ProgressBar
        value={metric.added ?? 0}
        total={total}
        label={"Added Packages"}
        className={classes.bar}
      />
      <ProgressBar
        value={metric.removed ?? 0}
        total={total}
        label={"Removed Packages"}
        className={classes.bar}
      />
      <ProgressBar
        value={metric.version ?? 0}
        total={total}
        label={"Version Chnages"}
      />
      <Typography
        variant="body2"
        className={classes.header}
        gutterBottom
        mt={2}
      >
        <b>Noteworthy Justifications</b>
      </Typography>
      <Divider className={classes.bar} />
      {Object.entries(metric.justification).map(([key, value]) => {
        return (
          <Typography variant="body2" gutterBottom key={key}>
            {key}: {value}
          </Typography>
        );
      })}
    </div>
  );
};

AdviseMetric.propTypes = {
  metric: PropTypes.shape({
    added: PropTypes.number,
    removed: PropTypes.number,
    version: PropTypes.number,
    unchanged: PropTypes.number,
    justification: PropTypes.object,
    build: PropTypes.string
  })
};

export default AdviseMetric;
