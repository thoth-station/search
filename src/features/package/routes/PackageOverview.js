// React
import React, { useEffect, useMemo, useState } from "react";

// local
import { PackageDependencies, PackageHeader } from "../components";

// material-ui
import { CircularProgress, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { usePackageMetadata } from "api";
import { PackageNotFound } from "./PackageNotFound";
import { useAllVersions, useSimpleGraph } from "../hooks";
import { usePackageEnvironments } from "../api";

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
    const [defaultSpecs, setDefaultSpecs] = useState({
        package_version: undefined,
        index_url: undefined,
        os_name: undefined,
        os_version: undefined,
        python_version: undefined,
    });

    // what is on the url params
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
    const allEnvironments = usePackageEnvironments(
        specs.package_name,
        specs.package_version ?? defaultSpecs.package_version,
        specs.index_url ?? defaultSpecs.index_url,
        { useErrorBoundary: false },
    );

    // some params are optional but still need a default value
    useEffect(() => {
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
        }

        // get default environment
        // needs list of environments
        if (
            allEnvironments.data &&
            allEnvironments.data.data.environments.length > 0
        ) {
            const filtered = allEnvironments.data.data.environments.filter(
                env =>
                    (!specs.os_name || specs.os_name === env.os_name) &&
                    (!specs.os_version || specs.os_version === env.os_version),
            );
            if (filtered.length > 0) {
                d.os_name = filtered.at(0).os_name;
                d.os_version = filtered.at(0).os_version;
                d.python_version = filtered.at(0).python_version;
            }
        }

        if (Object.entries(defaultSpecs).some(([key, val]) => d[key] !== val)) {
            setDefaultSpecs(d);
        }
    }, [allVersions, allEnvironments, specs]);

    // get package metadata
    const metadata = usePackageMetadata(
        specs.package_name,
        specs.package_version ?? defaultSpecs.package_version,
        specs.index_url ?? defaultSpecs.index_url,
        specs.os_name ?? defaultSpecs.os_name,
        specs.os_version ?? defaultSpecs.os_version,
        specs.python_version ?? defaultSpecs.python_version,
        { useErrorBoundary: false },
    );

    const graph = useSimpleGraph(metadata);

    if (metadata.isLoading || allVersions?.length === 0) {
        return (
            <div
                className="w-full h-48 flex justify-center items-center"
                data-testid="loading"
            >
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
                <Grid item xs={12} mb={3}>
                    <PackageHeader
                        metadata={
                            metadata.data.data.metadata.importlib_metadata
                                .metadata
                        }
                        allVersions={allVersions}
                        allEnvironments={allEnvironments.data.data.environments}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <PackageDependencies graph={graph} />
                </Grid>
            </Grid>
        </SpecContext.Provider>
    );
};

PackageOverview.propTypes = {
    metadata: PropTypes.object,
};
