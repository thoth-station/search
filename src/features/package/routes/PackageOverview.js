// React
import React, { useMemo } from "react";

// local
import { PackageHeader } from "../components";

// material-ui
import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { usePackageMetadata } from "features/misc/api";
import { PackageNotFound } from "./PackageNotFound";
import { useAllVersions } from "../hooks";

// component styling
const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        maxWidth: "95%",
        marginLeft: "auto",
        marginRight: "auto",
        paddingRight: theme.spacing(3),
        paddingLeft: theme.spacing(3),
        marginTop: theme.spacing(1),
    },
}));

export const SpecContext = React.createContext({});

// The page that displays all analysis data
export const PackageOverview = () => {
    const classes = useStyles();
    const params = useParams();

    const specs = useMemo(() => {
        return {
            package_name: params.package_name,
            package_version: params?.package_version,
            index_url: params?.index_url
                ? decodeURIComponent(params.index_url)
                : undefined,
            os_name: params?.os_name,
            os_version: params?.os_version,
            python_version: params?.python_version,
        };
    }, [params]);

    // get all pages of versions/indexes and merge them together
    const allVersions = useAllVersions(specs.package_name);

    // get environments for specific package, version, index
    // const allEnvironments = useAllEnvironments(
    //     specs.package_name,
    //     specs.package_version ?? defaultSpecs.package_version,
    //     specs.index_url ?? defaultSpecs.index_url,
    // );
    const allEnvironments = [
        {
            os_name: "rhel",
            os_version: "9",
            python_version: "3.9",
        },
    ];

    // some params are optional but still need a default value
    const defaultSpecs = useMemo(() => {
        let d = {
            package_version: undefined,
            index_url: undefined,
            os_name: undefined,
            os_version: undefined,
            python_version: undefined,
        };

        // get default package version and index
        // needs package name and versions list
        if (specs.package_name && allVersions && allVersions.length > 0) {
            d.package_version = allVersions.at(0).package_version;
            d.index_url = allVersions.at(0).index_url;
        } else {
            return d;
        }

        // get default environment
        // needs list of environments
        if (allEnvironments) {
            d.os_name = allEnvironments.at(0).os_name;
            d.os_version = allEnvironments.at(0).os_version;
            d.python_version = allEnvironments.at(0).python_version;
        } else {
            return d;
        }

        return d;
    }, [allVersions, allEnvironments, specs]);

    // get package metadata
    const metadata = usePackageMetadata(
        specs.package_name,
        specs.package_version ?? defaultSpecs.package_version,
        specs.index_url ?? defaultSpecs.index_url,
        { useErrorBoundary: false },
    );

    if (metadata.isLoading || allVersions?.length === 0) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    if (!metadata.data) {
        return (
            <PackageNotFound
                package_name={params.package_name}
                package_version={params.package_version ?? ""}
            />
        );
    }

    return (
        <SpecContext.Provider value={{ specs, defaultSpecs }}>
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <PackageHeader
                        metadata={metadata.data.data.metadata}
                        allVersions={allVersions}
                        allEnvironments={allEnvironments}
                    />
                </Grid>
            </Grid>
        </SpecContext.Provider>
    );
};

PackageOverview.propTypes = {
    metadata: PropTypes.object,
};
