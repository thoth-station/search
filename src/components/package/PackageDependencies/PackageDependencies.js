// react
import React from "react";
import PropTypes from "prop-types";

// local
import ProgressBar from "components/Elements/ProgressBar";

// material-ui
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  bar: {
    marginBottom: theme.spacing(1)
  }
}));

/**
 * A metric card displaying dependency information of a single package.
 */
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
    /** An object holding metric info. */
  metric: PropTypes.shape({
        /**
         * ```
         * all: {
         *     direct: 6,
         *     indirect: 22
         * }
         * ```
         */
    all: PropTypes.shape({
        /** Direct dependencies of the package. */
      direct: PropTypes.number,
        /** Indirect dependencies of the package (dependencies of direct and indirect packages) */
      indirect: PropTypes.number
    })
  })
};

export default PackageDependencies;
