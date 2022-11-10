import { Card, CardContent, CardHeader, Divider, Grid, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { TimelineChart } from "./TimelineChart";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import ArrowBackIosRoundedIcon from "@mui/icons-material/ArrowBackIosRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Link } from "react-router-dom";

interface IUnmaintainedPackages {
  unmaintainedPackages?: {
    data?: {
      total: number;
      packages: { id: string; not_maintained?: boolean; last_release?: string; low_maintainers?: boolean }[];
    };
  };
}

export const UnmaintainedPackages = ({ unmaintainedPackages }: IUnmaintainedPackages) => {
  const [selected, setSelected] = useState<number>(0);

  const next = () => {
    setSelected((selected + 1) % (unmaintainedPackages?.data?.packages?.length ?? 0));
  };
  const previous = () => {
    setSelected(
      (((selected - 1) % (unmaintainedPackages?.data?.packages?.length ?? 0)) +
        (unmaintainedPackages?.data?.packages?.length ?? 0)) %
        (unmaintainedPackages?.data?.packages?.length ?? 0),
    );
  };

  if (!unmaintainedPackages) {
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="rectangular" width={210} height={118} />
      </>
    );
  } else if (!unmaintainedPackages.data || unmaintainedPackages.data?.packages?.length === 0) {
    return null;
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title="Package Maintenance"
        subheader="Which packages are not well maintained or haven't released a new version recently"
      />
      <CardContent>
        <Grid container justifyContent="center">
          <Grid item width={"100%"}>
            <Typography textAlign="center" sx={{ marginBottom: 1 }} variant="body2">
              Number of months a package last had a release
            </Typography>
          </Grid>
          <Grid item style={{ height: "100%", width: "100%" }}>
            <TimelineChart
              source={unmaintainedPackages.data.packages
                .filter(obj => obj.last_release !== undefined)
                .map(obj => [obj.id, obj.last_release])}
              selected={unmaintainedPackages.data.packages[selected].id}
            />
          </Grid>
          <Grid item width={"100%"} sx={{ marginBottom: 2 }}>
            <Stack direction="row" alignItems="center">
              <IconButton onClick={previous}>
                <ArrowBackIosRoundedIcon fontSize="small" />
              </IconButton>
              <Typography variant="body1" fontWeight="bold">{`${selected + 1}/${
                unmaintainedPackages.data.packages.length
              }`}</Typography>
              <IconButton onClick={next}>
                <ArrowForwardIosRoundedIcon fontSize="small" />
              </IconButton>
              <Typography variant="body1" fontWeight="bold">
                <Link replace to={"../packages/" + unmaintainedPackages.data.packages[selected].id}>
                  {unmaintainedPackages.data.packages[selected].id}
                </Link>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              {unmaintainedPackages.data.packages[selected].not_maintained ? (
                <ClearRoundedIcon color="error" fontSize="small" />
              ) : (
                <CheckRoundedIcon color="success" fontSize="small" />
              )}
              <Typography variant="body2">{`Package is ${
                unmaintainedPackages.data.packages[selected].not_maintained ? "not" : ""
              } actively maintained according to Security Scorecards`}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              {unmaintainedPackages.data.packages[selected].low_maintainers ? (
                <ClearRoundedIcon color="error" fontSize="small" />
              ) : (
                <CheckRoundedIcon color="success" fontSize="small" />
              )}
              <Typography variant="body2">{`Package has ${
                unmaintainedPackages.data.packages[selected].low_maintainers
                  ? "low number of maintainers on PyPI (less than 3)"
                  : "sufficient maintainers on PyPI (more than 3)"
              }`}</Typography>
            </Stack>
            {unmaintainedPackages.data.packages[selected].last_release ? (
              <Typography sx={{ marginLeft: 3.5 }} variant="body2">{`Package's last release was on ${new Date(
                unmaintainedPackages.data.packages[selected].last_release ?? "",
              ).toDateString()}`}</Typography>
            ) : undefined}
          </Grid>
          <Grid item xs={12} sx={{ marginBottom: 2 }}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Typography fontWeight="bold" textAlign="center" variant="body1">
                {`${
                  Array.from(unmaintainedPackages.data.packages.values()).filter(p => p.low_maintainers).length
                } out of ${unmaintainedPackages.data.total}`}
              </Typography>
              <Typography textAlign="center" variant="body1">
                packages have a low number of maintainers ( less than 3 )
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" spacing={1}>
              <Typography fontWeight="bold" textAlign="center" variant="body1">
                {`${
                  Array.from(unmaintainedPackages.data.packages.values()).filter(p => p.not_maintained).length
                } out of ${unmaintainedPackages.data.total}`}
              </Typography>
              <Typography textAlign="center" variant="body1">
                packages are not maintained according to Security Scorecards
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
