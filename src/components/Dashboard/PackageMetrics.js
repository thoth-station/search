// local components
import NetworkGraph from "components/Metrics/DependenciesMetric/NetworkGraph.js";
import InfoCard from "components/InfoCard/InfoCard";

// utils
import { getScaleFreeNetwork } from "utils/getScaleFreeNetwork";

// material-ui
import Grid from "@material-ui/core/Grid";

const MetricLayout = ({ data }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <InfoCard
          cardMeta={{
            title: "Dependencies"
          }}
          cardBody={null}
        />
      </Grid>
      <Grid item xs={6}>
        <InfoCard
          cardMeta={{
            title: "Licenses"
          }}
          cardBody={null}
        />
      </Grid>
      <Grid item xs={6}>
        <InfoCard
          cardMeta={{
            title: "Security Advisories"
          }}
          cardBody={null}
        />
      </Grid>
    </Grid>
  );
};

export default MetricLayout;
