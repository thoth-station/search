// React
import React from "react";

// local
import { PackageHeader } from "../components";

// material-ui
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import PropTypes from "prop-types";

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

// The page that displays all analysis data
export const PackageOverview = ({ metadata }) => {
    const classes = useStyles();

    return (
        <Grid container className={classes.root}>
            <Grid item xs={12}>
                <PackageHeader metadata={metadata} />
            </Grid>
        </Grid>
    );
};

PackageOverview.propTypes = {
    metadata: PropTypes.object,
};
