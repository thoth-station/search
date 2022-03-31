// react
import React from "react";

// material-ui
import { TransitionGroup } from "react-transition-group";

import {
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    Grid,
    Collapse,
    Box,
    Skeleton,
} from "@mui/material";

import { DependencyMetricType } from "hooks/metrics";
import ProgressBar from "components/Elements/ProgressBar";

interface IDependenciesMetric {
    metric: DependencyMetricType | null;
}

/**
 * A metric card that displays direct, indirect, and root packages of a dependency graph.
 */
export const DependenciesMetric = ({ metric }: IDependenciesMetric) => {
    const totalDependencies =
        (metric?.all?.direct ?? 0) +
        (metric?.all?.indirect ?? 0) +
        (metric?.all?.roots ?? 0);

    if (!metric?.all || !metric?.roots) {
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
            <Typography variant="h6" gutterBottom>
                All Packages
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <ProgressBar
                value={metric?.all?.roots ?? 0}
                total={totalDependencies}
                label={"Root"}
                mb={1}
            />
            <ProgressBar
                value={metric?.all?.direct ?? 0}
                total={totalDependencies}
                label={"Direct"}
                mb={1}
            />
            <ProgressBar
                value={metric?.all?.indirect ?? 0}
                total={totalDependencies}
                label={"Indirect"}
            />
            <Typography variant="h6" gutterBottom mt={2}>
                Root Packages
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List component="nav">
                <TransitionGroup>
                    {Object.entries(metric?.roots ?? {})?.map(([key]) => {
                        const t =
                            (metric?.roots[key].direct ?? 0) +
                            (metric?.roots[key].indirect ?? 0);
                        return (
                            <Collapse key={key}>
                                <div>
                                    <ListItem>
                                        <Grid container alignItems="center">
                                            <Grid item xs>
                                                <ListItemText primary={key} />
                                            </Grid>
                                            <Grid item xs>
                                                <Grid
                                                    container
                                                    direction="column"
                                                >
                                                    <Grid item xs>
                                                        <ProgressBar
                                                            value={
                                                                metric?.roots?.[
                                                                    key
                                                                ]?.direct ?? 0
                                                            }
                                                            total={t}
                                                            label={"Direct"}
                                                        />
                                                    </Grid>
                                                    <Grid item xs>
                                                        <ProgressBar
                                                            value={
                                                                metric?.roots?.[
                                                                    key
                                                                ]?.indirect ?? 0
                                                            }
                                                            total={t}
                                                            label={"Indirect"}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider
                                        variant={"middle"}
                                        sx={{ mb: 1 }}
                                    />
                                </div>
                            </Collapse>
                        );
                    })}
                </TransitionGroup>
            </List>
        </>
    );
};
