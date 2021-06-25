// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Divider } from "@material-ui/core";

// local
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";
import ProgressBar from "components/Shared/ProgressBar";

const useStyles = makeStyles(theme => ({
  bar: {
    marginBottom: theme.spacing(1)
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  }
}));

const LicenseMetric = ({ metric, deepError }) => {
  const classes = useStyles();
  const totalLicenses = Object.keys(metric?.all ?? {}).reduce(
    (sum, key) => sum + parseFloat(metric.all[key] || 0),
    0
  );

  return (
    <div className={classes.root}>
      <Typography variant="body2" gutterBottom className={classes.label}>
        <b>License</b>
      </Typography>
      <Divider />
      <Typography className={classes.marginBottom} variant="h6">
        {metric.root}
      </Typography>
      <Typography variant="body2" gutterBottom className={classes.label}>
        <b>Dependency Licenses</b>
      </Typography>
      <Divider />
      <LoadingErrorTemplate
        state={deepError ? "error" : metric.all}
        errorText="Could not run analysis on dependencies."
      >
        {Object.entries(metric?.all ?? {}).map(([key, value]) => {
          return (
            <ProgressBar
              key={key}
              value={value ?? 0}
              total={totalLicenses}
              label={key}
              className={classes.bar}
            />
          );
        })}
      </LoadingErrorTemplate>
    </div>
  );
};

LicenseMetric.propTypes = {
  metric: PropTypes.shape({
    root: PropTypes.string,
    all: PropTypes.object
  }).isRequired
};

export default LicenseMetric;
