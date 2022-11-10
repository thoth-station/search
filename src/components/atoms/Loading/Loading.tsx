import { Box, CircularProgress, Typography } from "@mui/material";
import React from "react";

interface ILoading {
  loadingLabel?: string;
  errorTitle?: string;
  errorSubtitle?: string;
  progress?: number;
  isLoading?: boolean;
  isError?: boolean;
}

/** A centered loading element in place of a not yet loaded component */
const Loading = ({
  isLoading = false,
  isError = false,
  loadingLabel,
  progress,
  errorTitle,
  errorSubtitle,
}: ILoading) => {
  if (isError) {
    return (
      <Box height="100%" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
        <Typography variant="h5" align="center">
          {errorTitle ?? "An error occurred"}
        </Typography>
        <Typography variant="body2" align="center">
          {errorSubtitle}
        </Typography>
      </Box>
    );
  } else if (isLoading) {
    return (
      <Box height="100vh" flexDirection="column" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress variant={progress ? "determinate" : undefined} value={progress} />
        <Typography variant="body2">{loadingLabel}</Typography>
      </Box>
    );
  } else {
    return null;
  }
};

export default Loading;
