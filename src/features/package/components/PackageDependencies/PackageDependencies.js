// react
import React, { useMemo } from "react";
import PropTypes from "prop-types";

// material-ui
import InfoCard from "components/Elements/InfoCard";
import { Box, Divider, Grid, Skeleton, Typography } from "@material-ui/core";
import { VersionDropdown } from "./VersionDropdown";


/**
 * A metric card displaying dependency information of a single package.
 */
export const PackageDependencies = ({ graph }) => {
    const metric = useMemo(() => {
        if(!graph) {
            return;
        }

        const bfs = graph.graphSearch(graph.nodes.get("*App"));
        const visitedOrder = Array.from(bfs);

        const metric = []

        visitedOrder.forEach(node => {
            if (node.key !== "*App" && !node.value.metadata) {
                metric.push({
                    name: node.value.label,
                    versions: node.value.versions,
                    specifier: node.value.specifier,
                    extra: node.value.extra,
                })
            }
        })

        return metric
    }, [graph])


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
        <InfoCard
            cardMeta={{
                title: "Dependencies",
            }}
            cardBody={
                <div>
                    <Grid container>
                        <Grid item xs>
                            <Typography variant="h6" gutterBottom>
                                Package
                            </Typography>
                        </Grid>
                        <Grid item xs>
                            <Typography variant="h6" gutterBottom>
                                Versions
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="h6" gutterBottom>
                                Extra
                            </Typography>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Grid container rowSpacing={2} mt={1}>
                        {metric.map(node => {
                            return (
                                <Grid container item xs={12} key={node.name}>
                                    <Grid item xs>
                                        <Typography variant="body1" gutterBottom>
                                            {node.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <VersionDropdown node={node}/>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography variant="body1" gutterBottom>
                                            {node.extra?.join(", ")}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </Grid>
                </div>
            }
        />
    );
};

PackageDependencies.propTypes = {
    /** An object holding metric info. */
    graph: PropTypes.shape({
        graphSearch: PropTypes.func,
        nodes: PropTypes.instanceOf(Map)
    }),
};
