// react
import React from "react";

// material ui
import { CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";

// component styling

const useStyles = makeStyles(theme => ({
  customProgressRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

/**
 * Custom Progress bar with text.
 */
const CustomProgress = ({ amount, note }) => {
  const classes = useStyles();
  return (
    <div className={classes.customProgressRoot}>
      <CircularProgress
        variant={amount ? "determinate" : "indeterminate"}
        value={amount ?? 0}
      />
      {note ? (
        <Typography align="center" variant="body1">
          {note}
        </Typography>
      ) : null}
    </div>
  );
};

CustomProgress.propTypes = {
  /** a number ranging from 0 - 100 of progress through loading */
  amount: PropTypes.number,
  /** The optional text displayed under the progress */
  note: PropTypes.string
}

export default CustomProgress;
