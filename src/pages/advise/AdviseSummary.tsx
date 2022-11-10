import React from "react";
import AdviseHeader from "components/organisms/AdviseHeader";
import { Masonry } from "@mui/lab";
import CVEPackages from "components/organisms/summary_charts/CVEPackages";
import DependencySummary from "components/organisms/summary_charts/DependencySummary";
import LicenseSummary from "components/organisms/summary_charts/LicenseSummary";
import UnmaintainedPackages from "components/organisms/summary_charts/UnmaintainedPackages";
import WarningPackages from "components/organisms/summary_charts/WarningPackages";

export const AdviseSummary = ({ analysis_id }: { analysis_id: string }) => {
  return (
    <Masonry columns={{ xs: 1, md: 2 }} spacing={3} sx={{ mb: 3, mt: 1 }}>
      <AdviseHeader analysis_id={analysis_id} />
      <WarningPackages analysis_id={analysis_id} />
      <CVEPackages analysis_id={analysis_id} />
      <LicenseSummary analysis_id={analysis_id} />
      <DependencySummary analysis_id={analysis_id} />
      <UnmaintainedPackages analysis_id={analysis_id} />
    </Masonry>
  );
};
