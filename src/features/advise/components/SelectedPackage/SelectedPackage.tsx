// React
import React, { useContext, useMemo } from "react";

// material-ui
import {
    Typography,
    Grid,
    Box,
    Link,
    Stack,
    CardHeader,
    CardContent,
    Card,
    Divider,
    IconButton,
} from "@mui/material";
import GavelIcon from "@mui/icons-material/Gavel";
import ErrorRoundedIcon from "@mui/icons-material/ErrorRounded";

// local
import IconText from "components/Elements/IconText";
import NetworkGraphView from "../NetworkGraphView";
import { SelectedPackageContext } from "../../routes/AdviseDetails";
import { Graph } from "lib/interfaces/Graph";
import { Node } from "lib/interfaces/Node";
import { components } from "lib/schema";
import { PackageNodeValue } from "lib/interfaces/PackageNodeValue";
import { ScorecardMetric } from "../JustificationMetrics";
import { useScorecards } from "./hooks/useScorecards";
import { useLinkData } from "./hooks/useLinkData";

import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

interface ISelectedPackage {
    graph: Graph<Node<PackageNodeValue>>;
}

/**
 * Renders the selected package context variable's data. It will preform
 * a search of the list of packages using the selected package variable.
 */
export const SelectedPackage = ({ graph }: ISelectedPackage) => {
    const { selected, setSelected } = useContext(SelectedPackageContext);

    const selectedPackage = useMemo<Node<PackageNodeValue> | undefined>(() => {
        return graph.nodes.get(selected);
    }, [selected]);

    const dependents = useMemo<string[]>(() => {
        const deps: string[] = [];

        if (selectedPackage) {
            [...selectedPackage.parents]
                .filter(p => p !== "*App")
                .forEach(node => {
                    const nodeObj = graph.nodes.get(node);
                    if (nodeObj) {
                        deps.push(node);
                    }
                });
        }

        return deps;
    }, [selectedPackage]);

    const justifications = useMemo(() => {
        const justs: Map<
            string,
            components["schemas"]["Justification"][number]
        > = new Map();

        if (selectedPackage) {
            selectedPackage?.value?.justifications?.forEach(just => {
                justs.set(just.message, just);
            });
        }

        return justs;
    }, [selectedPackage]);

    const scorecards = useScorecards(justifications);

    const linkData = useLinkData(justifications);

    const popular = useMemo(() => {
        if (justifications) {
            return Array.from(justifications.values()).find(s => {
                if (s.message.includes("popularity on GitHub")) {
                    justifications.delete(s.message);
                    return true;
                }
                return false;
            });
        }
    }, [justifications]);

    const browseLink = useMemo(() => {
        if (justifications) {
            const just = Array.from(justifications.values()).find(s => {
                if (s.message.includes("Thoth Search UI")) {
                    justifications.delete(s.message);
                    return true;
                }
                return false;
            });

            return just?.link;
        }
    }, [justifications]);


    const showError = useMemo(() => {
        return (
            <Stack direction="row" alignItems="center" sx={{ marginTop: 2 }}>
                <ErrorRoundedIcon color="error" sx={{ marginRight: ".5rem" }} />
                <Typography mb={0} color="error" gutterBottom variant="body2">
                    The package metadata could not be fetched.
                </Typography>
            </Stack>
        );
    }, []);

    return (
        <Box sx={{ overflow: "scroll" }}>
            <Card variant="outlined" sx={{ padding: 2 }}>
                <Grid container alignItems="center" mb={1}>
                    <Grid item>
                        <Typography variant="h3">
                            <Link underline="none" href={browseLink}>
                                <b>{selectedPackage?.value?.name}</b>
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography ml={2} variant="h6">
                            {selectedPackage?.value?.version}
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item>
                        <IconText
                            text={
                                selectedPackage?.value?.metadata?.License ??
                                "NaN"
                            }
                            icon={<GavelIcon />}
                        />
                    </Grid>
                    {Object.values(linkData).map((value, i) => {
                        return (
                            <React.Fragment key={value.link ?? "" + i}>
                                <Grid item>
                                    <Divider orientation="vertical" />
                                </Grid>
                                <Grid key={value.label} item>
                                    <IconText
                                        text={value.label ?? ""}
                                        icon={value.icon}
                                        link={value.link}
                                    />
                                </Grid>
                            </React.Fragment>
                        );
                    })}
                </Grid>

                <Typography sx={{ marginTop: 2 }} variant="body1">
                    {selectedPackage?.value?.metadata?.Summary}
                </Typography>

                {!selectedPackage?.value?.metadata && showError}
            </Card>

            {scorecards.length > 0 ? (
                <ScorecardMetric metric={scorecards} />
            ) : undefined}

            {popular ? (
                <Card variant="outlined" sx={{ marginTop: 2 }}>
                    <CardHeader
                        title={popular.message}
                        action={
                            <IconButton
                                href={popular.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <OpenInNewRoundedIcon />
                            </IconButton>
                        }
                        avatar={<StarRoundedIcon />}
                    />
                </Card>
            ) : undefined}

            {browseLink
                ? Array.from(justifications.values()).map((just, i) => {
                      return (
                          <Card
                              key={just.message + i}
                              variant="outlined"
                              sx={{ marginTop: 2 }}
                          >
                              <CardHeader
                                  title={just.message}
                                  action={
                                      <IconButton
                                          href={just.link}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                      >
                                          <OpenInNewRoundedIcon />
                                      </IconButton>
                                  }
                                  avatar={
                                      just.type === "ERROR" ? (
                                          <ErrorRoundedIcon color="error" />
                                      ) : just.type === "WARNING" ? (
                                          <WarningAmberRoundedIcon color="warning" />
                                      ) : (
                                          <InfoRoundedIcon color="info" />
                                      )
                                  }
                              />
                          </Card>
                      );
                  })
                : undefined}

            <Card variant="outlined" sx={{ marginTop: 2 }}>
                <CardHeader
                    title="Dependency Graph"
                    subheader={
                        <Typography variant="body1" mb={2}>
                            {[...(selectedPackage?.parents ?? [])].filter(
                                p => p !== "*App",
                            )?.length === 0
                                ? selectedPackage?.value?.label +
                                  " is not a dependent of any package in this Python environment"
                                : "There are " +
                                  [...(selectedPackage?.parents ?? [])].filter(
                                      p => p !== "*App",
                                  )?.length +
                                  " package(s) that have " +
                                  selectedPackage?.value?.label +
                                  " as a direct dependency: "}
                            {dependents.map((dep, i) => {
                                return (
                                    <React.Fragment key={dep + i}>
                                        <Link
                                            underline="hover"
                                            onClick={() => setSelected(dep)}
                                        >
                                            {dep}
                                        </Link>{" "}
                                    </React.Fragment>
                                );
                            })}
                        </Typography>
                    }
                />
                <CardContent>
                    <NetworkGraphView graph={graph} />
                </CardContent>
            </Card>
        </Box>
    );
};
