import React  from "react";
import { AdviseHeader } from "../components";
import { Box, Grid } from "@mui/material";
import { AdviseDocumentRequestResponseSuccess } from "../api";
import { useImportantJustifications } from "../hooks/useImportantJustifications";
import { CVEPackages, WarningPackages } from "../components/SummaryCharts";

interface IAdviseSummary {
  adviseDocument?: AdviseDocumentRequestResponseSuccess;
  lastLog?: { [key: string]: string };
}

export const AdviseSummary = ({ adviseDocument, lastLog }: IAdviseSummary) => {
  const summary = useImportantJustifications(adviseDocument);

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
      </Grid>
    </Box>
  );
};
