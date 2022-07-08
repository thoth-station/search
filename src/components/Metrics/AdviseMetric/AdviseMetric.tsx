// react
import React from "react";

// material-ui
import { Typography, Divider, Skeleton, Box } from "@mui/material";

// local
import ProgressBar from "components/Elements/ProgressBar";
import { AdviseMetricType } from "hooks/metrics";

interface IAdviseMetric {
  /** The metric object info of aggregated data */
  metric: AdviseMetricType | null;
}

/**
 * A metric card that aggregates changes between the initial dependency
 * graph and the Thoth made dependency graph.
 */
export const AdviseMetric = ({ metric }: IAdviseMetric) => {
  const justTotal = Object.values(metric?.justification ?? {}).reduce((a, b) => a + b, 0);

  if (!metric) {
    return (
      <Box>
        <Skeleton />
        <Skeleton />
        <Skeleton width={"60%"} />
      </Box>
    );
  }

  return (
    <>
      <Typography variant="body2" gutterBottom>
        {metric?.build}
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <Typography variant="h6" mt={3} gutterBottom>
        Justification Counts
      </Typography>
      <Divider sx={{ mb: 1 }} />
      {Object.entries(metric?.justification ?? {}).map(([key, value]) => {
        return <ProgressBar key={key} value={value} total={justTotal} label={key} mb={1} />;
      })}
    </>
  );
};
