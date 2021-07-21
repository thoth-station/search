// React
import React, { useContext } from "react";

// local components
import InfoCard from "./InfoCard";
import DependenciesMetric from "components/Dashboard/Summary/Metrics/DependenciesMetric";
import LicenseMetric from "components/Dashboard/Summary/Metrics/LicenseMetric";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// material-ui
import Grid from "@material-ui/core/Grid";

// redux
import { StateContext } from "App";

const MetricLayout = () => {
  const state = useContext(StateContext);

  return (
    <LoadingErrorTemplate isLoading={state?.metrics === undefined}>
      <Grid container spacing={3}>
        {state?.metrics
          ? Object.keys(state.metrics).map(key => {
              return (
                <Grid item xs={12} sm={6} key={key}>
                  <InfoCard
                    cardMeta={{
                      title: key.charAt(0).toUpperCase() + key.slice(1)
                    }}
                    cardBody={
                      key === "dependencies" ? (
                        <DependenciesMetric />
                      ) : key === "licenses" ? (
                        <LicenseMetric />
                      ) : null
                    }
                  />
                </Grid>
              );
            })
          : null}
      </Grid>
    </LoadingErrorTemplate>
  );
};

export default MetricLayout;