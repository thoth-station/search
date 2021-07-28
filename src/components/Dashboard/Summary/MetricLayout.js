// React
import React, { useContext } from "react";

// local components
import InfoCard from "./InfoCard";
import DependenciesMetric from "components/Dashboard/Summary/Metrics/DependenciesMetric";
import LicenseMetric from "components/Dashboard/Summary/Metrics/LicenseMetric";
import AdviseMetric from "components/Dashboard/Summary/Metrics/AdviseMetric";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// material-ui
import { Grid } from "@material-ui/core";

// redux
import { StateContext } from "App";

const MetricLayout = () => {
  const state = useContext(StateContext);

  return (
    <LoadingErrorTemplate isLoading={state?.metrics === undefined}>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6}>
          <InfoCard
            cardMeta={{
              title: "Thoth Advise Summary"
            }}
            cardBody={<AdviseMetric />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoCard
            cardMeta={{
              title: "Dependencies Summary"
            }}
            cardBody={<DependenciesMetric />}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InfoCard
            cardMeta={{
              title: "Licenses Summary"
            }}
            cardBody={<LicenseMetric />}
          />
        </Grid>
      </Grid>
    </LoadingErrorTemplate>
  );
};

export default MetricLayout;
