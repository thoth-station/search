import React from "react";
import InfoCard from "components/Elements/InfoCard";
import {
    AdviseMetric,
    DependenciesMetric,
    LicenseMetric,
} from "components/Metrics";
import { AllMetrics } from "../hooks";
import { AdviseHeader } from "../components";
import { Box, Grid } from "@mui/material";
import { AdviseDocumentRequestResponseSuccess } from "../api";

interface IAdviseSummary {
    metrics: AllMetrics;
    adviseDocument?: AdviseDocumentRequestResponseSuccess;
    lastLog?: { [key: string]: string };
}

export const AdviseSummary = ({
    metrics,
    adviseDocument,
    lastLog,
}: IAdviseSummary) => {
    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <AdviseHeader adviseDocument={adviseDocument} lastLog={lastLog} />
                </Grid>


                <Grid item xs={12} sm={6}>
                    <InfoCard
                        cardMeta={{
                            title: "Thoth Advise Summary",
                        }}
                        cardBody={<AdviseMetric metric={metrics?.advise} />}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InfoCard
                        cardMeta={{
                            title: "Dependencies Summary",
                        }}
                        cardBody={
                            <DependenciesMetric metric={metrics?.dependencies} />
                        }
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <InfoCard
                        cardMeta={{
                            title: "Licenses Summary",
                        }}
                        cardBody={<LicenseMetric metric={metrics?.licenses} />}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};
