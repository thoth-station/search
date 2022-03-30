// react
import React from "react";

// material-ui
import { Typography } from "@mui/material";

interface ILockfileView {
    /** The Pipfile.lock json object */
    file: { default: { [key: string]: unknown } };
}

/**
 * Renders out a Pipfile.lock file and attaches
 * `<a>` tags to package names, which is used to
 *  scroll to certain spot in the lock file
 */
export const LockfileView = ({ file }: ILockfileView) => {
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
                            (match: string) => {
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
