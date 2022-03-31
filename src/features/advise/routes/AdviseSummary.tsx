import React from "react";
import InfoCard from "components/Elements/InfoCard";
import { CustomCardAction } from "../components";
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
    const [pipfile, setPipfile] = React.useState<"newGraph" | "oldGraph">(
        "newGraph",
    );

    const handlePipfile = (
        event: any,
        newPipfile: "newGraph" | "oldGraph" | "",
    ) => {
        if (newPipfile !== "") {
            setPipfile(newPipfile);
        }
    };

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
                        <DependenciesMetric
                            metric={metrics?.[pipfile]?.dependencies}
                        />
                    }
                    cardAction={
                        <CustomCardAction
                            value={pipfile}
                            onChange={handlePipfile}
                        />
                    }
                />
            </div>
            <div>
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
            </div>
        </Masonry>
    );
};
