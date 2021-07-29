// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { withStyles, makeStyles } from "@material-ui/styles";
import { LinearProgress, Typography, Tooltip, Grid } from "@material-ui/core";

const CustomLinearProgress = withStyles(theme => ({
  root: {
    height: 10,
    borderRadius: 5
  },
  colorPrimary: {
    backgroundColor:
      theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
  },
  bar: {
    borderRadius: 5,
    backgroundColor: "#1a90ff"
  }
}))(LinearProgress);

const useStyles = makeStyles(theme => ({
  root: {
    display: "grid",
    gridTemplateColumns: "repeat(6,1fr)",
    alignItems: "center",
    gridGap: theme.spacing(1)
  },
  label: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  value: {
    textAlign: "end"
  }
}));

const ProgressBar = ({ value, total, label, action, ...props }) => {
  const classes = useStyles();
  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={4}>
        <Typography variant="body2" className={classes.label}>
          {label}
        </Typography>
      </Grid>
      <Grid item xs={1}>
        <Typography className={classes.value} variant="body2">
          {value}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <CustomLinearProgress
          variant="determinate"
          value={total > 0 ? (value / total) * 100 : 0}
        />
      </Grid>
      <Grid item xs>
        <div>{action ?? null}</div>
      </Grid>
    </Grid>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  label: PropTypes.string
};

export default ProgressBar;
