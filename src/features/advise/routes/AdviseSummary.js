import React from "react";
import { Grid } from "@material-ui/core";
import InfoCard from "components/Elements/InfoCard";
import { CustomCardAction } from "../components";
import PropTypes from "prop-types";
import { AdviseMetric, DependenciesMetric, LicenseMetric } from "components/Metrics";

export const AdviseSummary = ({ metrics }) => {
    const [pipfile, setPipfile] = React.useState("newGraph");

    const handlePipfile = (event, newPipfile) => {
        if (newPipfile?.length) {
            setPipfile(newPipfile);
        }
    };

    return (
        <Grid container spacing={3} mb={3} mt={1}>
            <Grid item xs={12} md={6}>
                <InfoCard
                    cardMeta={{
                        title: "Thoth Advise Summary",
                    }}
                    cardBody={<AdviseMetric metric={metrics?.advise} />}
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <InfoCard
                    cardMeta={{
                        title: "Dependencies Summary",
                    }}
                    cardBody={
                        <DependenciesMetric
                            all={metrics?.[pipfile]?.dependencies?.all}
                            roots={metrics?.[pipfile]?.dependencies?.roots}
                        />
                    }
                    cardAction={
                        <CustomCardAction
                            value={pipfile}
                            onChange={handlePipfile}
                        />
                    }
                />
            </Grid>
            <Grid item xs={12} md={6}>
                <InfoCard
                    cardMeta={{
                        title: "Licenses Summary",
                    }}
                    cardBody={
                        <LicenseMetric metric={metrics?.[pipfile]?.licenses} />
                    }
                    cardAction={
                        <CustomCardAction
                            value={pipfile}
                            onChange={handlePipfile}
                        />
                    }
                />
            </Grid>
        </Grid>
    );
};

AdviseSummary.propTypes = {
    metrics: PropTypes.object,
};
