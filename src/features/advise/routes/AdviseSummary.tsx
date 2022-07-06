import React  from "react";
import { AdviseHeader } from "../components";
import { Box, Grid } from "@mui/material";
import { AdviseDocumentRequestResponseSuccess } from "../api";
import { useImportantJustifications } from "../hooks/useImportantJustifications";
import { CVEPackages, WarningPackages } from "../components/SummaryCharts";
import { useMetrics } from "../hooks";
import { LicenseSummary } from "../components/SummaryCharts/LicenseSummary";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";

interface IAdviseSummary {
  adviseDocument?: AdviseDocumentRequestResponseSuccess;
  graph?: Graph<Node<PackageNodeValue>>,
  lastLog?: { [key: string]: string };
}

export const AdviseSummary = ({ adviseDocument, graph, lastLog }: IAdviseSummary) => {
  const summary = useImportantJustifications(adviseDocument);
  const metrics = useMetrics(graph, adviseDocument);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <AdviseHeader adviseDocument={adviseDocument} lastLog={lastLog} />
        </Grid>

        <Grid item xs={12} sm={6}>
          <WarningPackages warningPackages={summary?.warningPackages} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <CVEPackages cvePackages={summary?.cvePackages} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <LicenseSummary licenses={metrics?.licenses} />
        </Grid>
      </Grid>
    </Box>
  );
};
