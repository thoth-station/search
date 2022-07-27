import { Card, CardContent, CardHeader, Grid, Skeleton, Stack, Typography } from "@mui/material";
import React, { useMemo } from "react";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import { LicenseMetricType } from "../../../../hooks/metrics";

interface ILicenseSummary {
  licenses: LicenseMetricType | null;
}

export const LicenseSummary = ({ licenses }: ILicenseSummary) => {
  const { warnings, errors, approved, totalPkgErrors, totalPkgWarnings, totalPkgApproved } = useMemo(() => {
    if (licenses) {
      let warnings = 0;
      let totalPkgWarnings = 0;
      let errors = 0;
      let totalPkgErrors = 0;
      let approved = 0;
      let totalPkgApproved = 0;

      Object.entries(licenses).forEach(([, value]) => {
        if (value.metadata.isOsiApproved === null) {
          totalPkgWarnings += Object.keys(value.packages).length;
          warnings++;
        } else if (!value.metadata.isOsiApproved) {
          totalPkgErrors += Object.keys(value.packages).length;
          errors++;
        } else {
          totalPkgApproved += Object.keys(value.packages).length;
          approved++;
        }
      });
      return {
        warnings: warnings,
        totalPkgWarnings: totalPkgWarnings,
        totalPkgErrors: totalPkgErrors,
        errors: errors,
        approved: approved,
        totalPkgApproved: totalPkgApproved,
      };
    }

    return {
      warnings: null,
      totalPkgWarnings: null,
      errors: null,
      totalPkgErrors: null,
      approved: null,
      totalPkgApproved: null,
    };
  }, [licenses]);

  if (!licenses) {
    return null;
  } else if (warnings === null || errors === null) {
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="rectangular" height={118} />
      </>
    );
  }
  return (
    <Card variant="outlined">
      <CardHeader
        title="Unapproved Licenses"
        subheader="Total number of licenses that are unknown or unapproved by OSI"
      />
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={1}>
              <DoneRoundedIcon color="success" />
              <Typography variant="h4">Approved</Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Typography variant="h4">{approved}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ marginLeft: 4.5 }}
              variant="body1"
              color="gray"
            >{`${totalPkgApproved} total packages`}</Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={1}>
              <WarningAmberOutlinedIcon color="warning" />
              <Typography variant="h4">Unknown Approval</Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Typography variant="h4">{warnings}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ marginLeft: 4.5 }}
              variant="body1"
              color="gray"
            >{`${totalPkgWarnings} total packages`}</Typography>
          </Grid>
        </Grid>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ErrorOutlineOutlinedIcon color="error" />
              <Typography variant="h4">Unapproved</Typography>
            </Stack>
          </Grid>
          <Grid item>
            <Typography variant="h4">{errors}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography
              sx={{ marginLeft: 4.5 }}
              variant="body1"
              color="gray"
            >{`${totalPkgErrors} total packages`}</Typography>
          </Grid>
        </Grid>
        {errors === 0 && warnings === 0 ? (
          <Stack direction="row" alignItems="center" spacing={1}>
            <DoneRoundedIcon color="success" />
            <Typography variant="h4">All licenses are OSI approved</Typography>
          </Stack>
        ) : undefined}
      </CardContent>
    </Card>
  );
};
