// react
import React from "react";
import PropTypes from "prop-types";

// material-ui

import { Typography } from "@mui/material";



/**
 * Renders out a Pipfile.lock file and attaches
 * `<a>` tags to package names, which is used to
 *  scroll to certain spot in the lock file
 */
export const LockfileView = ({ file }) => {


    return (
        <Typography variant="caption">
            <pre>
                <div

                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(file, undefined, 4)?.replaceAll(
                            new RegExp(
                                '("' +
                                    Object.keys(file?.default)?.join('"|"') +
                                    '")',
                                "g",
                            ),
                            match => {
                                return `<a id="${match.slice(
                                    1,
                                    -1,
                                )}">${match}</a>`;
                            },
                        ),
                    }}
                />
            </pre>
        </Typography>
    );
};

LockfileView.propTypes = {
    /** The Pipfile.lock json object */
    file: PropTypes.shape({ default: PropTypes.object.isRequired }),
};
