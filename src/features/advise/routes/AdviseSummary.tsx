import React from "react";
import InfoCard from "components/Elements/InfoCard";
import {
    AdviseMetric,
    DependenciesMetric,
    LicenseMetric,
} from "components/Metrics";
import { Masonry } from "@mui/lab";
import { AllMetrics } from "../hooks";
import { AdviseHeader } from "../components";
import { Box } from "@mui/material";
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
            <AdviseHeader adviseDocument={adviseDocument} lastLog={lastLog} />
            <Masonry
                columns={{ xs: 1, md: 2 }}
                spacing={2}
                sx={{ margin: "0 auto" }}
            >
                <InfoCard
                    cardMeta={{
                        title: "Thoth Advise Summary",
                    }}
                    cardBody={<AdviseMetric metric={metrics?.advise} />}
                />
                <InfoCard
                    cardMeta={{
                        title: "Dependencies Summary",
                    }}
                    cardBody={
                        <DependenciesMetric metric={metrics?.dependencies} />
                    }
                />
                <InfoCard
                    cardMeta={{
                        title: "Licenses Summary",
                    }}
                    cardBody={<LicenseMetric metric={metrics?.licenses} />}
                />
            </Masonry>
        </Box>
    );
};
