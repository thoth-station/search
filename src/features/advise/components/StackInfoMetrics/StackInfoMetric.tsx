import React, { useMemo } from "react";
import { Box, Card, CardContent, CardHeader, Chip, Divider, Grid, IconButton, Stack, Typography } from "@mui/material";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { components } from "lib/schema";

export const StackInfoMetric = ({ metrics }: { metrics: Map<string, components["schemas"]["StackInfo"]> }) => {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down("md"));

  const typeTotals = useMemo(() => {
    return {
      info: Array.from(metrics.values()).reduce((p, c) => p + (c[0].type === "INFO" ? 1 : 0), 0),
      warning: Array.from(metrics.values()).reduce((p, c) => p + (c[0].type === "WARNING" ? 1 : 0), 0),
      error: Array.from(metrics.values()).reduce((p, c) => p + (c[0].type === "ERROR" ? 1 : 0), 0),
    };
  }, [metrics]);

  const renderRow = (key: string, value: components["schemas"]["StackInfo"]) => {
    return (
      <React.Fragment key={key}>
        <Grid item xs={12} sx={{ marginY: 1 }}>
          <Divider flexItem />
        </Grid>
        <Grid item xs={1}>
          <Box display="flex" alignContent="center">
            {value[0].type === "ERROR" ? (
              <ErrorOutlineOutlinedIcon color="error" />
            ) : value[0].type === "WARNING" ? (
              <WarningAmberOutlinedIcon color="warning" />
            ) : (
              <InfoOutlinedIcon color="info" />
            )}
          </Box>
        </Grid>
        <Grid item xs={10}>
          <Stack spacing={1}>
            {value.map((v: { message: string }) => (
              <Typography key={v.message} variant="body2">
                {v.message}
              </Typography>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={1}>
          <IconButton href={value[0].link} target="_blank" rel="noopener noreferrer">
            <OpenInNewRoundedIcon />
          </IconButton>
        </Grid>
      </React.Fragment>
    );
  };

  return (
    <>
      {compact ? (
        <Card variant="outlined">
          <CardHeader
            title="Other Stack Info"
            titleTypographyProps={{
              variant: "h6",
            }}
            avatar={
              <Stack direction="row" spacing={1}>
                {typeTotals.info ? (
                  <Chip icon={<InfoOutlinedIcon />} label={typeTotals.info} color="info" />
                ) : undefined}
                {typeTotals.warning ? (
                  <Chip icon={<WarningAmberOutlinedIcon />} label={typeTotals.warning} color="warning" />
                ) : undefined}
                {typeTotals.error ? (
                  <Chip icon={<ErrorOutlineOutlinedIcon />} label={typeTotals.error} color="error" />
                ) : undefined}
              </Stack>
            }
          />
        </Card>
      ) : (
        <Card variant="outlined">
          <CardHeader title="Other Stack Info" />
          <CardContent>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bolder">
                  Recommended Actions
                </Typography>
              </Grid>
              {Array.from(metrics.entries())
                .filter(([, value]) =>
                  value.some((v: { message: string }) => v.message.includes("use") || v.message.includes("Use")),
                )
                .map(([key, value]) => renderRow(key, value))}
              <Grid item xs={12} sx={{ marginTop: 2 }}>
                <Typography variant="body1" fontWeight="bolder">
                  Other Information
                </Typography>
              </Grid>
              {Array.from(metrics.entries())
                .filter(([, value]) =>
                  value.some((v: { message: string }) => !v.message.includes("use") || v.message.includes("Use")),
                )
                .map(([key, value]) => renderRow(key, value))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </>
  );
};
