// react
import React from "react";
import PropTypes from "prop-types";

// material-ui

import { Typography, Divider } from "@mui/material";

// local
import ProgressBar from "components/Elements/ProgressBar";



/**
 * A metric card showing a package's (and its dependencies') licenses
 */
export const PackageLicenses = ({ metric }) => {
    return (
        <div >
            <Typography variant="body2" gutterBottom>
                <b>License</b>
            </Typography>
            <Divider />
            <Typography  variant="h6">
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
