// react
import React from "react";
import PropTypes from "prop-types";

// local
import ProgressBar from "components/shared/ProgressBar";

// material-ui
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  bar: {
    marginBottom: theme.spacing(1)
  }
}));

const PackageDependencies = ({ metric }) => {
  const classes = useStyles();
  const totalDependencies =
    (metric.all.direct ?? 0) + (metric.all.indirect ?? 0);

  return (
    <div>
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
    </div>
  );
};

PackageDependencies.propTypes = {
  metric: PropTypes.shape({
    all: PropTypes.shape({
      direct: PropTypes.number,
      indirect: PropTypes.number
    })
  })
};

export default PackageDependencies;
