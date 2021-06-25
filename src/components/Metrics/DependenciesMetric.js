// react
import React from "react";
import PropTypes from "prop-types";

// local
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";
import ProgressBar from "components/Shared/ProgressBar";

// material-ui
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  bar: {
    marginBottom: theme.spacing(1)
  }
}));

const DependenciesMetric = ({ metric, deepError }) => {
  const classes = useStyles();
  const totalDependencies = (metric.direct ?? 0) + (metric.indirect ?? 0);

  return (
    <div className={classes.root}>
      <LoadingErrorTemplate state={metric.direct}>
        <ProgressBar
          value={metric.direct ?? 0}
          total={totalDependencies}
          label={"Direct"}
          className={classes.bar}
        />
      </LoadingErrorTemplate>

      <LoadingErrorTemplate
        state={deepError ? "error" : metric.indirect}
        errorText="Could not run analysis on dependencies."
      >
        <ProgressBar
          value={metric.indirect ?? 0}
          total={totalDependencies}
          label={"Indirect"}
        />
      </LoadingErrorTemplate>
    </div>
  );
};

DependenciesMetric.propTypes = {
  metric: PropTypes.shape({
    direct: PropTypes.number,
    indirect: PropTypes.number
  }).isRequired
};

export default DependenciesMetric;
