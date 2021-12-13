// React
import React, { useContext, useMemo } from "react";

// material-ui
import { Typography, Grid, Box, Paper, Link, Button } from "@material-ui/core";
import GavelIcon from "@material-ui/icons/Gavel";

// local
import IconText from "components/Elements/IconText";
import NetworkGraphView from "../NetworkGraphView";

// redux
import { SelectedPackageContext } from "../../../routes/AdviseDetails";
import PropTypes from "prop-types";
import { Graph } from "utils/Graph";

/**
 * Renders the selected package context variable's data. It will preform
 * a search of the list of packages using the selected package variable.
 */
export const SelectedPackage = ({ mergedGraph }) => {
    const { selected, setSelected } = useContext(SelectedPackageContext);

    const selectedPackage = mergedGraph.nodes.get(selected);

    const dependents = { removed: [], added: [], version: [], unchanged: [] };
    [...(selectedPackage?.parents ?? [])]
        .filter(p => p !== "*App")
        .forEach(node => {
            dependents[mergedGraph.nodes.get(node).value.change].push(node);
        });

    const justifications = useMemo(() => {
        const justs = {};
        selectedPackage?.value?.justifications?.thoth?.forEach(just => {
            justs[just.type] = [...(justs[just.type] ?? []), just];
        });

        return justs;
    }, [selectedPackage]);

    return (
        <Box>
            <Paper sx={{ padding: 2 }}>
                <Grid container alignItems="center" mb={1}>
                    <Grid item>
                        <Typography variant="h3">
                            <b>{selectedPackage?.value?.metadata?.name}</b>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography ml={2} variant="h6">
                            v
                            {selectedPackage?.value?.metadata?.version ?? "NaN"}
                        </Typography>
                    </Grid>
                </Grid>

                <Typography gutterBottom variant="body1">
                    {selectedPackage?.value?.metadata?.summary ?? "NaN"}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item>
                        <IconText
                            text={
                                selectedPackage?.value?.metadata?.license ??
                                "NaN"
                            }
                            icon={<GavelIcon />}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Paper sx={{ padding: 2, marginTop: 2 }}>
                <Typography variant="h5">Thoth Justifications</Typography>
                <Typography variant="body1" mt={2}>
                    {selectedPackage?.value?.justifications?.header}
                </Typography>
                {selectedPackage?.value?.justifications?.reasons?.length ? (
                    <ul>
                        {selectedPackage?.value?.justifications?.reasons.map(
                            (reason, i) => {
                                return (
                                    <li key={i + reason.reason}>
                                        <Typography variant="body1" mt={2}>
                                            <Link
                                                underline="hover"
                                                onClick={() =>
                                                    setSelected(reason.package)
                                                }
                                            >
                                                {reason.package}
                                            </Link>
                                            {reason.reason}
                                        </Typography>
                                    </li>
                                );
                            },
                        )}
                    </ul>
                ) : null}

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
                                            <Typography
                                                variant="body2"
                                                ml={3}
                                                mt={0.5}
                                            >
                                                {reason.advisory}
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
                          " as a direct dependency. Of those package(s)"}

                    {Object.keys(dependents).map((change, i) => {
                        if (dependents[change].length === 0) {
                            return null;
                        }

                        return (
                            <React.Fragment key={change + i}>
                                {", " +
                                    dependents[change].length +
                                    (change === "version"
                                        ? " had a version change "
                                        : (dependents[change].length === 1
                                              ? " was "
                                              : " were ") + change) +
                                    " ("}
                                {dependents[change].map((p, i, a) => {
                                    let text = p;
                                    if (i !== a.length - 1) {
                                        text += ", ";
                                    }
                                    return (
                                        <Link
                                            key={i + text}
                                            underline="hover"
                                            onClick={() => setSelected(p)}
                                        >
                                            {text}
                                        </Link>
                                    );
                                })}
                                {")"}
                            </React.Fragment>
                        );
                    })}
                    {"."}
                </Typography>

                <NetworkGraphView mergedGraph={mergedGraph} />
            </Paper>
        </Box>
    );
};

SelectedPackage.propTypes = {
    mergedGraph: PropTypes.objectOf(Graph),
};
