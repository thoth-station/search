// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { withStyles, makeStyles } from "@material-ui/styles";
import { LinearProgress, Typography, Tooltip } from "@material-ui/core";

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
    gridColumnStart: 1,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  value: {
    gridColumnStart: 2,
    textAlign: "end"
  },
  bar: {
    gridColumnStart: "span 3"
  },
  end: {
    gridColumnStart: 6
  }
}));

const ProgressBar = ({ value, total, label, action, ...props }) => {
  const classes = useStyles();
  return (
    <div className={`${classes.root} ${props.className}`}>
      <Tooltip title={label} placement="left">
        <Typography variant="body2" className={classes.label}>
          {label}
        </Typography>
      </Tooltip>

      <Typography className={classes.value} variant="body2">
        {value}
      </Typography>

      <CustomLinearProgress
        variant="determinate"
        value={total > 0 ? (value / total) * 100 : 0}
        className={classes.bar}
      />
      <div className={classes.end}>{action ?? null}</div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  label: PropTypes.string
};

export default ProgressBar;
