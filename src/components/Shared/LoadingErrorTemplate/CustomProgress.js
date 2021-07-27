// react
import React from "react";

// material ui
import { CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// component styling

const useStyles = makeStyles(theme => ({
  customProgressRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

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

export default CustomProgress;
