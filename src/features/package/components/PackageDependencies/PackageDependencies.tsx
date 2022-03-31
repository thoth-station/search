// react
import React, { useMemo } from "react";

// material-ui
import InfoCard from "components/Elements/InfoCard";
import { Box, Divider, Grid, Skeleton, Typography } from "@mui/material";
import { VersionDropdown } from "./VersionDropdown";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { SimplePackageNodeValue } from "lib/interfaces/SimplePackageNodeValue";

interface IPackageDependencies {
    graph?: Graph<Node<SimplePackageNodeValue>>;
}

type PackageDependenciesMetric = {
    name: string;
    versions: string[];
    specifier: string;
    extra: string[];
};

/**
 * A metric card displaying dependency information of a single package.
 */
export const PackageDependencies = ({ graph }: IPackageDependencies) => {
    const metric = useMemo(() => {
        if (!graph?.nodes) {
            return;
        }

        const root = graph.nodes.get("*App");

        if (root) {
            const bfs = graph.graphSearch(root);
            const visitedOrder = Array.from(bfs);

            const metric: PackageDependenciesMetric[] = [];

            visitedOrder.forEach(node => {
                if (node.key !== "*App" && !node.value.metadata) {
                    metric.push({
                        name: node.value.label ?? node.key,
                        versions: node.value.versions ?? [],
                        specifier: node.value.specifier ?? "*",
                        extra: node.value.extra ?? [],
                    });
                }
            });

            return metric;
        }
    }, [graph]);

    if (!metric) {
        return (
            <Box data-testid="package-dependencies-not-loaded">
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
                <div data-testid="package-dependencies-loaded">
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
                                        <Typography
                                            variant="body1"
                                            gutterBottom
                                        >
                                            {node.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs>
                                        <VersionDropdown node={node} />
                                    </Grid>
                                    <Grid item xs={2}>
                                        <Typography
                                            variant="body1"
                                            gutterBottom
                                        >
                                            {node.extra?.join(", ")}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            );
                        })}
                    </Grid>
                </div>
            }
        />
    );
};
