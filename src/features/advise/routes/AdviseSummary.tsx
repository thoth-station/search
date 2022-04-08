import React from "react";
import InfoCard from "components/Elements/InfoCard";
import {
    AdviseMetric,
    DependenciesMetric,
    LicenseMetric,
} from "components/Metrics";
import { Masonry } from "@mui/lab";
import { AllMetrics } from "../hooks";

interface IAdviseSummary {
    metrics: AllMetrics;
}

export const AdviseSummary = ({ metrics }: IAdviseSummary) => {
    return (
        <Masonry columns={{ xs: 1, md: 2 }} spacing={3} sx={{ mb: 3, mt: 1 }}>
            <div>
                <InfoCard
                    cardMeta={{
                        title: "Thoth Advise Summary",
                    }}
                    cardBody={<AdviseMetric metric={metrics?.advise} />}
                />
            </div>
            <div>
                <InfoCard
                    cardMeta={{
                        title: "Dependencies Summary",
                    }}
                    cardBody={
                        <DependenciesMetric metric={metrics?.dependencies} />
                    }
                />
            </div>
            <div>
                <InfoCard
                    cardMeta={{
                        title: "Licenses Summary",
                    }}
                    cardBody={<LicenseMetric metric={metrics?.licenses} />}
                />
            </div>
        </Masonry>
    );
};
