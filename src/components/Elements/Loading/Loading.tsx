import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material";
import React, { useMemo } from "react";

interface ILoading {
  type: "circular" | "bar";
  label?: string;
  progress?: number;
}

const Loading = ({ type, label, progress }: ILoading) => {
  return useMemo(() => {
    if (type === "bar") {
      return (
        <Box height="100vh" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
          <LinearProgress variant={progress ? "determinate" : undefined} value={progress} />
          <Typography variant="body2">{label}</Typography>
        </Box>
      );
    } else {
      return (
        <Box height="100vh" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
          <CircularProgress variant={progress ? "determinate" : undefined} value={progress} />
          <Typography variant="body2">{label}</Typography>
        </Box>
      );
    }
  }, [type, label, progress]);
};

export default Loading;
