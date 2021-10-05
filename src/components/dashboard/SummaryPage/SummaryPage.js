// React
import React, { useContext } from "react";

// local components
import InfoCard from "components/shared/InfoCard";
import DependenciesMetric from "./DependenciesMetric";
import LicenseMetric from "./LicenseMetric";
import AdviseMetric from "./AdviseMetric";
import LoadingErrorTemplate from "components/shared/LoadingErrorTemplate";
import CustomCardAction from "./CustomCardAction";

// material-ui
import { Grid } from "@material-ui/core";

// redux
import { StateContext } from "App";

const SummaryPage = () => {
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
            cardBody={<AdviseMetric metric={state?.metrics?.advise} />}
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

export default SummaryPage;
