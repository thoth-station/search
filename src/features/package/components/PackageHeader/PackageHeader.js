import React, { useContext, useMemo, useState } from "react";

// material-ui
import { Grid, IconButton, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import GavelIcon from "@mui/icons-material/Gavel";

// local
import IconText from "components/Elements/IconText";

// utils
import PropTypes from "prop-types";
import { ParamDropdown } from "../ParamDropdown";
import { SpecContext } from "../../routes/PackageOverview";

// component styling
const useStyles = makeStyles(theme => ({
    titleRow: {
        display: "flex",
        alignItems: "center",
    },
    marginLeft: {
        marginLeft: theme.spacing(2),
    },
    linksRow: {
        display: "flex",
    },
}));

/**
 * A header for package metadata.
 */
export const PackageHeader = ({ metadata, allVersions, allEnvironments }) => {
    const classes = useStyles();
    const { defaultSpecs, specs } = useContext(SpecContext);
    const [showEnvParams, setShowEnvParams] = useState(false);

    const versionOptions = useMemo(() => {
        const dups = new Set();
        return allVersions
            .filter(version => {
                if (!dups.has(version.package_version)) {
                    dups.add(version.package_version);
                    return true;
                }
                return false;
            })
            .map(version => {
                return {
                    value: version.package_version,
                };
            });
    }, [allVersions]);

    const indexUrlOptions = useMemo(() => {
        return allVersions
            .filter(version => {
                if (specs.package_version) {
                    return specs.package_version === version.package_version;
                } else {
                    return (
                        defaultSpecs.package_version === version.package_version
                    );
                }
            })
            .map(version => {
                return {
                    value: version.index_url,
                };
            });
    }, [allVersions]);

    const [osNameOptions, osVersionOptions, pythonVersionOptions] =
        useMemo(() => {
            const name = allEnvironments.map(env => {
                return {
                    value: env.os_name,
                };
            });
            const version = allEnvironments.map(env => {
                return {
                    value: env.os_version,
                };
            });
            const pyVersion = allEnvironments.map(env => {
                return {
                    value: env.python_version,
                };
            });
            return [name, version, pyVersion];
        }, [allEnvironments]);

    return (
        <div>
            <Grid container alignItems="flex-end" spacing={1}>
                <Grid item>
                    <Typography variant="h4" mr={2}>
                        <b>{metadata?.name}</b>
                    </Typography>
                </Grid>
                <Grid item>
                    <ParamDropdown
                        options={versionOptions ?? []}
                        type="package_version"
                        label={"Version"}
                    />
                </Grid>
                <Grid item>
                    <ParamDropdown
                        options={indexUrlOptions ?? []}
                        type="index_url"
                        label={"Index URL"}
                        disabled={specs.package_version === undefined}
                    />
                </Grid>
                {showEnvParams ? (
                    <React.Fragment>
                        <Grid item>
                            <ParamDropdown
                                options={osNameOptions ?? []}
                                type="os_name"
                                label={"OS Name"}
                                disabled={specs.index_url === undefined}
                            />
                        </Grid>
                        <Grid item>
                            <ParamDropdown
                                options={osVersionOptions ?? []}
                                type="os_version"
                                label={"OS Version"}
                                disabled={specs.os_name === undefined}
                            />
                        </Grid>
                        <Grid item>
                            <ParamDropdown
                                options={pythonVersionOptions ?? []}
                                type="python_version"
                                label={"Python Version"}
                                disabled={specs.os_version === undefined}
                            />
                        </Grid>
                    </React.Fragment>
                ) : null}
                <Grid item xs={1}>
                    <IconButton
                        onClick={() => setShowEnvParams(!showEnvParams)}
                    >
                        {showEnvParams ? (
                            <ArrowLeftIcon fontSize="large" />
                        ) : (
                            <ArrowRightIcon fontSize="large" />
                        )}
                    </IconButton>
                </Grid>
            </Grid>

            <Typography gutterBottom variant="body1">
                {metadata?.summary ?? "NaN"}
            </Typography>
            <div className={classes.linksRow}>
                <IconText
                    text={metadata?.license ?? "NaN"}
                    icon={<GavelIcon />}
                />
            </div>
        </div>
    );
};

PackageHeader.propTypes = {
    /** Package metadata object.*/
    metadata: PropTypes.shape({
        /** Name of package. */
        name: PropTypes.string.isRequired,
        /** Version of package. */
        version: PropTypes.string.isRequired,
        /** The latest version of the package. (used to calculate the time sense last update) */
        latest_version: PropTypes.string,
        /** Description of package. */
        summary: PropTypes.string,
        /** License of package */
        license: PropTypes.string,
    }),
    /** list of all versions of a package **/
    allVersions: PropTypes.array.isRequired,
    /** list of all environments of a package, version, index **/
    allEnvironments: PropTypes.array.isRequired,
};
