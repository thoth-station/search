// local components
import InfoCard from "components/InfoCard/InfoCard";
import DependenciesMetric from "components/Metrics/DependenciesMetric";
import LicenseMetric from "components/Metrics/LicenseMetric";

// material-ui
import Grid from "@material-ui/core/Grid";

const MetricLayout = ({ state }) => {
  return (
    <Grid container spacing={3}>
      {Object.entries(state.metrics).map(([key, value]) => {
        return (
          <Grid item xs={12} sm={6} key={key}>
            <InfoCard
              cardMeta={{
                title: key.charAt(0).toUpperCase() + key.slice(1)
              }}
              cardBody={
                key === "dependencies" ? (
                  <DependenciesMetric
                    metric={value}
                    deepError={state.error.graph}
                  />
                ) : key === "licenses" ? (
                  <LicenseMetric metric={value} deepError={state.error.graph} />
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
