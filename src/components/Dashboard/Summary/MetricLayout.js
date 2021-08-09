// React
import React, { useContext } from "react";

// local components
import InfoCard from "./InfoCard";
import DependenciesMetric from "components/Dashboard/Summary/Metrics/DependenciesMetric";
import LicenseMetric from "components/Dashboard/Summary/Metrics/LicenseMetric";
import AdviseMetric from "components/Dashboard/Summary/Metrics/AdviseMetric";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// material-ui
import { Grid, ToggleButtonGroup, ToggleButton } from "@material-ui/core";

// redux
import { StateContext } from "App";

const CustomCardAction = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup value={value} exclusive size="small" onChange={onChange}>
      <ToggleButton value="old">Old</ToggleButton>
      <ToggleButton value="new">New</ToggleButton>
    </ToggleButtonGroup>
  );
};

const MetricLayout = () => {
  const state = useContext(StateContext);

  const [pipfile, setPipfile] = React.useState("new");

  const handlePipfile = (event, newPipfile) => {
    if (newPipfile?.length) {
      setPipfile(newPipfile);
    }
  };

  return (
    <LoadingErrorTemplate isLoading={state?.metrics === undefined}>
      <Grid container spacing={3} mb={3} mt={1}>
        <Grid item xs={12} md={6}>
          <InfoCard
            cardMeta={{
              title: "Thoth Advise Summary"
            }}
            cardBody={<AdviseMetric />}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard
            cardMeta={{
              title: "Dependencies Summary"
            }}
            cardBody={
              <DependenciesMetric
                metric={state?.metrics?.[pipfile]?.dependencies}
              />
            }
            cardAction={
              <CustomCardAction value={pipfile} onChange={handlePipfile} />
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoCard
            cardMeta={{
              title: "Licenses Summary"
            }}
            cardBody={
              <LicenseMetric metric={state?.metrics?.[pipfile]?.licenses} />
            }
            cardAction={
              <CustomCardAction value={pipfile} onChange={handlePipfile} />
            }
          />
        </Grid>
      </Grid>
    </LoadingErrorTemplate>
  );
};

export default MetricLayout;
