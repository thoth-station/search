// React
import React, { useContext } from "react";

// local components
import InfoCard from "components/InfoCard/InfoCard";
import DependenciesMetric from "components/Metrics/DependenciesMetric";
import LicenseMetric from "components/Metrics/LicenseMetric";

// material-ui
import Grid from "@material-ui/core/Grid";

// redux
import { StateContext } from "App";

const MetricLayout = () => {
  const state = useContext(StateContext);

  return (
    <Grid container spacing={3}>
      {Object.keys(state.metrics).map(key => {
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
      })}
    </Grid>
  );
};

export default MetricLayout;
