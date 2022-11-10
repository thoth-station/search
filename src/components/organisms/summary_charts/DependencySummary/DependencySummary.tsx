import { Card, CardContent, CardHeader, Grid, Skeleton, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDependencyMetric } from "hooks";
import PieChart from "components/molecules/PieChart";

const DependencySummary = ({ analysis_id }: { analysis_id: string }) => {
  const { data: dependencies } = useDependencyMetric(analysis_id);
  const [hovered, setHovered] = useState<{ label: string } | undefined>();

  if (!dependencies) {
    return (
      <>
        <Skeleton variant="text" />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </>
    );
  }

  return (
    <Card variant="outlined">
      <CardHeader
        title="Project Dependencies"
        subheader="Packages are categorized based on their depth in the dependency tree,
                   with roots being the packages defined on the Pipfile"
      />

      <CardContent>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Grid item md={12} lg={4}>
            <PieChart
              hovered={hovered}
              setHovered={setHovered}
              source={[
                { label: "Roots", angle: dependencies.roots },
                { label: "Direct", angle: dependencies.direct },
                { label: "Indirect", angle: dependencies.indirect },
              ]}
            />
          </Grid>
          <Grid item md={12} lg={8}>
            <Stack justifyContent="space-around" width="100%">
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontWeight={hovered?.label === "Roots" ? "bold" : undefined} variant="h4">
                      Root Packages
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item>
                  <Typography fontWeight={hovered?.label === "Roots" ? "bold" : undefined} variant="h4">
                    {dependencies.roots}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontWeight={hovered?.label === "Direct" ? "bold" : undefined} variant="h4">
                      Direct Packages
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item>
                  <Typography fontWeight={hovered?.label === "Direct" ? "bold" : undefined} variant="h4">
                    {dependencies.direct}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontWeight={hovered?.label === "Indirect" ? "bold" : undefined} variant="h4">
                      Indirect Packages
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item>
                  <Typography fontWeight={hovered?.label === "Indirect" ? "bold" : undefined} variant="h4">
                    {dependencies.indirect}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DependencySummary;
