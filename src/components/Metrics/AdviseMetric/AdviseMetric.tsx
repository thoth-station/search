// react
import React from "react";

// material-ui
import { Typography, Divider, Skeleton, Box } from "@mui/material";

// local
import ProgressBar from "components/Elements/ProgressBar";
import { AdviseMetricType } from "hooks/metrics";

interface IAdviseMetric {
    /** The metric object info of aggregated data */
    metric: AdviseMetricType | null;
}

/**
 * A metric card that aggregates changes between the initial dependency
 * graph and the Thoth made dependency graph.
 */
export const AdviseMetric = ({ metric }: IAdviseMetric) => {
    const total = metric
        ? metric.added + metric.removed + metric.version + metric.unchanged
        : 0;
    const justTotal = Object.values(metric?.justification ?? {}).reduce(
        (a, b) => a + b,
        0,
    );

    if (!metric) {
        return (
            <Box>
                <Skeleton />
                <Skeleton />
                <Skeleton width={"60%"} />
            </Box>
        );
    }

    return (
        <>
            <Typography variant="body2" gutterBottom>
                {metric?.build}
            </Typography>
            <Typography variant="h6" gutterBottom mt={2}>
                What Thoth Changed
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <ProgressBar
                value={metric?.added ?? 0}
                total={total}
                label={"Added Packages"}
                sx={{ mb: 1 }}
            />
            <ProgressBar
                value={metric?.removed ?? 0}
                total={total}
                label={"Removed Packages"}
                sx={{ mb: 1 }}
            />
            <ProgressBar
                value={metric?.version ?? 0}
                total={total}
                label={"Version Changes"}
            />
            <Typography variant="h6" mt={3} gutterBottom>
                Justification Counts
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {Object.entries(metric?.justification ?? {}).map(([key, value]) => {
                return (
                    <ProgressBar
                        key={key}
                        value={value}
                        total={justTotal}
                        label={key}
                        mb={1}
                    />
                );
            })}
        </>
    );
};
