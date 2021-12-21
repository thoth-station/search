// React
import React, { useMemo } from "react";

// local
import { PackageHeader } from "../components";

// material-ui
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";

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
export const PackageOverview = ({ metadata }) => {
    const classes = useStyles();
    const params = useParams();

    const specs = useMemo(() => {
        return {
            package_name: params.package_name,
            package_version: params?.package_version,
            os_name: params?.os_name,
            os_version: params?.os_version,
            index_url: params?.index_url,
        };
    }, [params]);

    return (
        <SpecContext.Provider value={specs}>
            <Grid container className={classes.root}>
                <Grid item xs={12}>
                    <PackageHeader metadata={metadata} />
                </Grid>
            </Grid>
        </SpecContext.Provider>
    );
};

PackageOverview.propTypes = {
    metadata: PropTypes.object,
};
