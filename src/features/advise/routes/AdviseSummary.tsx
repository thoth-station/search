import React from "react";
import { AdviseHeader } from "../components";
import { AdviseDocumentRequestResponseSuccess } from "../api";
import { useImportantJustifications } from "../hooks/useImportantJustifications";
import { CVEPackages, UnmaintainedPackages, WarningPackages } from "../components/SummaryCharts";
import { useMetrics } from "../hooks";
import { LicenseSummary } from "../components/SummaryCharts/LicenseSummary";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";
import { DependencySummary } from "../components/SummaryCharts/DependencySummary";
import { Masonry } from "@mui/lab";

interface IAdviseSummary {
  adviseDocument?: AdviseDocumentRequestResponseSuccess;
  graph?: Graph<Node<PackageNodeValue>>;
  lastLog?: { [key: string]: string };
}

export const AdviseSummary = ({ adviseDocument, graph, lastLog }: IAdviseSummary) => {
  const summary = useImportantJustifications(adviseDocument);
  const metrics = useMetrics(graph, adviseDocument);

  return (
    <Masonry columns={{ xs: 1, md: 2 }} spacing={3} sx={{ mb: 3, mt: 1 }}>
      <AdviseHeader adviseDocument={adviseDocument} lastLog={lastLog} />
      <WarningPackages warningPackages={summary?.warningPackages} />
      <CVEPackages cvePackages={summary?.cvePackages} />
      <LicenseSummary licenses={metrics?.licenses} />
      <DependencySummary dependencies={metrics?.dependencies} />
      <UnmaintainedPackages unmaintainedPackages={summary?.unmaintainedPackages} />
    </Masonry>
  );
};
