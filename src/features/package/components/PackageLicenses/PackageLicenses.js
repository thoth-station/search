// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Typography, Divider } from "@material-ui/core";

// local
import ProgressBar from "components/Elements/ProgressBar";

const useStyles = makeStyles(theme => ({
    bar: {
        marginBottom: theme.spacing(1),
    },
    marginBottom: {
        marginBottom: theme.spacing(2),
    },
}));

/**
 * A metric card showing a package's (and its dependencies') licenses
 */
export const PackageLicenses = ({ metric }) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="body2" gutterBottom>
                <b>License</b>
            </Typography>
            <Divider />
            <Typography className={classes.marginBottom} variant="h6">
                {metric.root}
            </Typography>
            <Typography variant="body2" gutterBottom>
                <b>Dependency Licenses</b>
            </Typography>
            <Divider />

            {Object.entries(metric?.all ?? {}).map(([key, value]) => {
                return (
                    <ProgressBar
                        key={key}
                        value={Object.keys(value).length ?? 0}
                        total={metric.total}
                        label={key}
                        className={classes.bar}
                    />
                );
            })}
        </div>
    );
};

PackageLicenses.propTypes = {
    metric: PropTypes.shape({
        /** The total number of dependencies of the package */
        total: PropTypes.number,
        /** The license of the root package */
        root: PropTypes.string,
        /** key value object of package's dependencies' licenses
         *
         * ```
         * all: {
         *     MIT: {
         *
         *     }
         * }
         * ```
         * */
        all: PropTypes.object,
    }).isRequired,
};
