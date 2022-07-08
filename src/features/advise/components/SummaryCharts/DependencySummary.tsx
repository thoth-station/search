import {
  Card,
  CardContent,
  CardHeader, Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { DependencyMetricType } from "../../../../hooks/metrics";
import { PieChart } from "./PieChart";

interface IDependencySummary {
  dependencies: DependencyMetricType | null;
}

export const DependencySummary = ({ dependencies }: IDependencySummary) => {
  const [hovered, setHovered] = useState<{label: string} | undefined>()
  if (!dependencies) {
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
      <CardHeader title="Project Dependencies"
                  subheader="Packages are categorized based on their depth in the dependency tree,
                   with roots being the packages defined on the Pipfile"
      />

      <CardContent>
        <Grid container direction="row" alignItems="center" spacing={1}>
          <Grid item md={12} lg={4}>
            <PieChart hovered={hovered} setHovered={setHovered}  source={[
              {label: "Roots", angle: dependencies.all.roots},
              {label: "Direct", angle: dependencies.all.direct},
              {label: "Indirect", angle: dependencies.all.indirect}
            ]}/>
          </Grid>
          <Grid item md={12} lg={8}>
            <Stack justifyContent="space-around" width="100%">
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontWeight={hovered?.label === "Roots" ? "bold" : undefined} variant="h4">Root Packages</Typography>
                  </Stack>
                </Grid>
                <Grid item>
                  <Typography fontWeight={hovered?.label === "Roots" ? "bold" : undefined} variant="h4">{dependencies.all.roots}</Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontWeight={hovered?.label === "Direct" ? "bold" : undefined} variant="h4">Direct Packages</Typography>
                  </Stack>
                </Grid>
                <Grid item>
                  <Typography fontWeight={hovered?.label === "Direct" ? "bold" : undefined} variant="h4">{dependencies.all.direct}</Typography>
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography fontWeight={hovered?.label === "Indirect" ? "bold" : undefined} variant="h4">Indirect Packages</Typography>
                  </Stack>
                </Grid>
                <Grid item>
                  <Typography fontWeight={hovered?.label === "Indirect" ? "bold" : undefined} variant="h4">{dependencies.all.indirect}</Typography>
                </Grid>
              </Grid>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
