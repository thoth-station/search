// React
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

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
        marginTop: theme.spacing(4),
    },
}));

export const SpecContext = React.createContext({});

// The page that displays all analysis data
export const PackageOverview = () => {
    const classes = useStyles();
    const params = useParams();
    // eslint-disable-next-line no-unused-vars
    const navigate = useNavigate();

    const specs = useMemo(() => {
        return {
            package_name: params.package_name,
            package_version: params?.package_version,
            os_name: params?.os_name,
            os_version: params?.os_version,
            index_url: params?.index_url,
        };
    }, [params]);

    // get all pages of versions and merge them together
    const allVersions = useAllVersions(specs.package_name);

    // select latest versions of package if none provided
    // wait for pagination to finish looping
    useEffect(() => {
        if (allVersions.length > 0 && !specs.package_version) {
            navigate(allVersions.at(0).package_version);
        }
    }, [allVersions]);

    // get package metadata
    const metadata = usePackageMetadata(
        specs.package_name,
        specs.package_version,
        specs.index_url,
        { useErrorBoundary: false },
    );

    if (metadata.isLoading || !specs.package_version) {
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
        <SpecContext.Provider value={specs}>
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <PackageHeader
                        metadata={metadata.data.data.metadata}
                        allVersions={allVersions}
                    />
                </Grid>
            </Grid>
        </SpecContext.Provider>
    );
};

PackageOverview.propTypes = {
    metadata: PropTypes.object,
};
