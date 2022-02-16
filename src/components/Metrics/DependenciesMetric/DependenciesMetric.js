// react
import React from "react";
import PropTypes from "prop-types";

// local
import ProgressBar from "components/Elements/ProgressBar";

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

/**
 * A metric card that displays direct, indirect, and root packages of a dependency graph.
 */
export const DependenciesMetric = ({ all, roots }) => {
    const totalDependencies =
        (all?.direct ?? 0) + (all?.indirect ?? 0) + (all?.roots ?? 0);

    if (!all || !roots) {
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
            <Divider mb={1} />
            <ProgressBar
                value={all?.roots ?? 0}
                total={totalDependencies}
                label={"Root"}
                mb={1}
            />
            <ProgressBar
                value={all?.direct ?? 0}
                total={totalDependencies}
                label={"Direct"}
                mb={1}
            />
            <ProgressBar
                value={all?.indirect ?? 0}
                total={totalDependencies}
                label={"Indirect"}
            />
            <Typography variant="h6" gutterBottom mt={2}>
                Root Packages
            </Typography>
            <Divider mb={1} />
            <List component="nav">
                <TransitionGroup>
                    {Object.entries(roots ?? {})?.map(([key]) => {
                        const t =
                            (roots[key].direct ?? 0) +
                            (roots[key].indirect ?? 0);
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
                                                                roots?.[key]
                                                                    ?.direct ??
                                                                0
                                                            }
                                                            total={t}
                                                            label={"Direct"}
                                                        />
                                                    </Grid>
                                                    <Grid item xs>
                                                        <ProgressBar
                                                            value={
                                                                roots?.[key]
                                                                    ?.indirect ??
                                                                0
                                                            }
                                                            total={t}
                                                            label={"Indirect"}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                    <Divider variant={"middle"} mb={1} />
                                </div>
                            </Collapse>
                        );
                    })}
                </TransitionGroup>
            </List>
        </>
    );
};

DependenciesMetric.propTypes = {
    /** summary object of all roots aggregated */
    all: PropTypes.shape({
        /** number of dependencies directly related to root packages */
        direct: PropTypes.number,
        /** number of dependencies directly or indirectly related to the direct packages*/
        indirect: PropTypes.number,
        /** number of dependencies that have no dependents*/
        roots: PropTypes.number,
    }),
    /** an object of key (package name) value pairs of specific roots with direct and indirect parameters for each value */
    roots: PropTypes.objectOf(
        PropTypes.shape({
            /** roots own direct packages */
            direct: PropTypes.number,
            /** roots own indirect packages */
            indirect: PropTypes.number,
        }),
    ),
};
