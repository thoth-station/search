// React
import React, { useContext, useMemo } from "react";

// material-ui
import {
    Typography,
    Grid,
    Box,
    Paper,
    Link,
    Button,
    Stack,
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
        const justs: { [key: string]: components["schemas"]["Justification"] } =
            {};

        if (selectedPackage) {
            console.log(selectedPackage);
            selectedPackage?.value?.justifications?.forEach(just => {
                justs[just.type] = [...(justs[just.type] ?? []), just];
            });
        }

        return justs;
    }, [selectedPackage]);

    const showError = useMemo(() => {
        return (
            <Stack direction="row" alignItems="center">
                <ErrorRoundedIcon color="error" sx={{ marginRight: ".5rem" }} />
                <Typography mb={0} color="error" gutterBottom variant="body2">
                    The package metadata could not be fetched. Package data will
                    be limited.
                </Typography>
            </Stack>
        );
    }, []);

    return (
        <Box>
            <Paper sx={{ padding: 2 }}>
                <Grid container alignItems="center" mb={1}>
                    <Grid item>
                        <Typography variant="h3">
                            <b>{selectedPackage?.value?.name}</b>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography ml={2} variant="h6">
                            {selectedPackage?.value?.version}
                        </Typography>
                    </Grid>
                </Grid>

                {!selectedPackage?.value?.metadata && showError}

                <Typography gutterBottom variant="body1">
                    {selectedPackage?.value?.metadata?.Summary}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <IconText
                            text={
                                selectedPackage?.value?.metadata?.License ??
                                "NaN"
                            }
                            icon={<GavelIcon />}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h5">Thoth Justifications</Typography>
                {Object.entries(justifications).map(([type, reasons]) => {
                    return (
                        <React.Fragment key={type}>
                            <Typography variant="h6" mt={2}>
                                {type} Justifications
                            </Typography>
                            {reasons.map((reason, i) => {
                                return (
                                    <Grid
                                        container
                                        alignItems="center"
                                        ml={3}
                                        key={reason.message + i}
                                    >
                                        <Grid item xs={10}>
                                            <Typography variant="body1" mt={1}>
                                                {reason.message}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Button href={reason.link}>
                                                READ MORE
                                            </Button>
                                        </Grid>
                                    </Grid>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </Paper>

            <Paper sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h5" mb={2}>
                    Package Origins
                </Typography>
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
                            <>
                                <Link
                                    key={dep + i}
                                    underline="hover"
                                    onClick={() => setSelected(dep)}
                                >
                                    {dep}
                                </Link>{" "}
                            </>
                        );
                    })}
                </Typography>

                <NetworkGraphView graph={graph} />
            </Paper>
        </Box>
    );
};
