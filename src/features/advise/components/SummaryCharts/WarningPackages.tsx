import { Card, CardContent, CardHeader, Divider, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { BubbleHistogram } from "./BubbleHistogram";
import React, { useState } from "react";
import { Link } from "react-router-dom";

interface IWarningPackages {
  warningPackages?: {
    values: [string, number][];
    top_packages: [string, number][];
    avg: number;
  };
}

export const WarningPackages = ({ warningPackages }: IWarningPackages) => {
  const [warningPackagesSelected, setWarningPackagesSelected] = useState<[string, number][]>([]);

  const handleClick = (pkgs: [string, number][]) => {
    setWarningPackagesSelected(pkgs);
  };

  if (!warningPackages) {
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="rectangular" width={210} height={118} />
      </>
    );
  }
  return (
    <Card variant="outlined">
      <CardHeader title="Package Warnings" subheader="The distribution of all package warnings" />
      <CardContent>
        <Grid container justifyContent="center">
          <Grid item style={{ height: "100%", width: "100%" }}>
            <BubbleHistogram source={warningPackages} handleClick={handleClick} />
          </Grid>
          <Grid item width={"100%"}>
            <Typography textAlign="center" sx={{ marginBottom: 0.5 }} variant="body1" fontStyle="italic">
              {warningPackagesSelected.length > 0
                ? `${warningPackagesSelected.length} packages selected`
                : "Click and drag on the chart to select packages"}
            </Typography>
            {warningPackagesSelected.length > 0 && (
              <>
                <Stack direction="row" spacing={1}>
                  <Typography fontWeight="bold" variant="body1">
                    Average Warnings:
                  </Typography>
                  <Typography variant="body1">
                    {(warningPackagesSelected.reduce((p, [, c]) => p + c, 0) / warningPackagesSelected.length).toFixed(
                      1,
                    )}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Typography fontWeight="bold" variant="body1">
                    Max Warnings:
                  </Typography>
                  <Typography variant="body1">
                    {warningPackagesSelected.sort(([, a], [, b]) => a - b).at(-1)?.[1]}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ marginBottom: 2 }}>
                  <Typography fontWeight="bold" variant="body1">
                    Min Warnings:
                  </Typography>
                  <Typography variant="body1">
                    {warningPackagesSelected.sort(([, a], [, b]) => a - b).at(0)?.[1]}
                  </Typography>
                </Stack>
                {Array.from(new Set(warningPackagesSelected.map(([, c]) => c)).values())
                  .sort((a, b) => b - a)
                  .map(count => (
                    <React.Fragment key={count}>
                      <Typography color="gray" variant="subtitle2" fontStyle="italic">{`${count} warnings`}</Typography>
                      <Divider />
                      <Grid
                        container
                        spacing={1.5}
                        sx={{
                          marginBottom: 1,
                          marginLeft: 1,
                        }}
                      >
                        {warningPackagesSelected
                          .filter(([, c]) => c === count)
                          .map(([pkg]) => (
                            <Grid key={pkg} item>
                              <Link replace to={"../packages/" + pkg}>
                                {pkg}
                              </Link>
                            </Grid>
                          ))}
                      </Grid>
                    </React.Fragment>
                  ))}
              </>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
