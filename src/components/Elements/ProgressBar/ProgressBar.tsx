// react
import React from "react";

// material-ui
import { LinearProgress, Typography, Grid } from "@mui/material";
import { GridProps } from "@mui/material/Grid/Grid";

interface IProps extends GridProps {
  /** the amount (numerator) for the bar */
  value: number;
  /** the total (denominator) for the bar */
  total: number;
  /** optional label */
  label?: string;
  /** action used on card */
  action?: JSX.Element;
}

/**
 * A horizontal bar for showing a percent of a total.
 */
const ProgressBar = ({ value, total, label, action, ...props }: IProps) => {
  return (
    <Grid container spacing={1} alignItems="center" {...props}>
      <Grid item xs={5}>
        <Typography variant="body2">{label}</Typography>
      </Grid>
      <Grid item xs={2}>
        <Typography variant="body2">{value}</Typography>
      </Grid>
      <Grid item xs>
        <LinearProgress
          variant="determinate"
          value={total > 0 ? (value / total) * 100 : 0}
          sx={{
            root: {
              height: 10,
              borderRadius: 5,
            },
            colorPrimary: {
              backgroundColor: "theme.palette.grey[200]",
            },
            bar: {
              borderRadius: 5,
              backgroundColor: "#1a90ff",
            },
          }}
        />
      </Grid>
      <Grid item xs={1}>
        <div>{action ?? null}</div>
      </Grid>
    </Grid>
  );
};

export default ProgressBar;
