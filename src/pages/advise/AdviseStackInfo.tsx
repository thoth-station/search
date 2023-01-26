import React, { useContext } from "react";

import { Box, Typography } from "@mui/material";
import { Masonry } from "@mui/lab";

import StackInfoEnvMetric from "components/organisms/metrics/StackInfoMetrics/StackInfoEnvMetric";
import StackInfoInstallErrorMetric from "components/organisms/metrics/StackInfoMetrics/StackInfoInstallErrorMetric";
import StackInfoMetric from "components/organisms/metrics/StackInfoMetrics/StackInfoMetric";
import StackInfoRulesMetric from "components/organisms/metrics/StackInfoMetrics/StackInfoRulesMetric";

import { StateContext } from "stores/Global";

export const AdviseStackInfo = ({ analysis_id }: { analysis_id: string }) => {
  const { loading } = useContext(StateContext);

  if (loading["graph"]) {
    return (
      <Box height="100vh" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h5" align="center">
          Stack info not available
        </Typography>
        <Typography variant="body2" align="center">
          The adviser has not finished resolving packages
        </Typography>
      </Box>
    );
  }

  return (
    <Masonry columns={{ sm: 1, lg: 2, xl: 4 }}>
      <StackInfoEnvMetric analysis_id={analysis_id} />
      <StackInfoInstallErrorMetric analysis_id={analysis_id} />
      <StackInfoRulesMetric analysis_id={analysis_id} />
      <StackInfoMetric analysis_id={analysis_id} />
    </Masonry>
  );
};
