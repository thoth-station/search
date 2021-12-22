import React, { useMemo } from "react";

// material-ui
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import GavelIcon from "@material-ui/icons/Gavel";
import BookmarkIcon from "@material-ui/icons/Bookmark";

// local
import IconText from "components/Elements/IconText";
import { VersionDropdown } from "components/Elements/VersionDropdown";

// utils
import timeSince from "utils/timeSince";
import PropTypes from "prop-types";

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
export const PackageHeader = ({ metadata, allVersions }) => {
    const classes = useStyles();

    // const env = [
    //     {
    //         index_url: "http://pypi.org/simple",
    //         os_name: "rhel",
    //         os_version: "8",
    //         python_version: "3.8",
    //     },
    //     {
    //         index_url: "http://pypi.org/simple",
    //         os_name: "fedora",
    //         os_version: "3.4",
    //         python_version: "3.9",
    //     },
    //     {
    //         index_url:
    //             "https://tensorflow.pypi.thoth-station.ninja/index/manylinux2010/AVX2/simple",
    //         os_name: "rhel",
    //         os_version: "8",
    //         python_version: "3.8",
    //     },
    //     {
    //         index_url:
    //             "https://tensorflow.pypi.thoth-station.ninja/index/manylinux2010/AVX2/simple",
    //         os_name: "fedora",
    //         os_version: "3.4",
    //         python_version: "3.9",
    //     },
    // ];

    const versionOptions = useMemo(() => {
        if (allVersions) {
            const noDup = new Set();
            return allVersions
                .filter(version => {
                    if (noDup.has(version.package_version)) {
                        return false;
                    }
                    noDup.add(version.package_version);
                    return true;
                })
                .map(version => {
                    return {
                        value: version.package_version,
                        isThoth: true,
                        isDefault: false,
                    };
                });
        } else {
            return [];
        }
    }, [allVersions]);

    return (
        <div>
            <div className={classes.titleRow}>
                <Typography variant="h4">
                    <b>{metadata?.name}</b>
                </Typography>
                {versionOptions === undefined ||
                versionOptions?.length === 0 ? (
                    <Typography ml={2} variant="h6">
                        {metadata?.version ?? "NaN"}
                    </Typography>
                ) : (
                    <VersionDropdown
                        sx={{ marginLeft: 2, minWidth: 120 }}
                        options={versionOptions ?? []}
                        label="Versions"
                        type="package_version"
                    />
                )}
            </div>

            <Typography gutterBottom variant="body1">
                {metadata?.summary ?? "NaN"}
            </Typography>
            <div className={classes.linksRow}>
                <IconText
                    text={metadata?.license ?? "NaN"}
                    icon={<GavelIcon />}
                />
                <IconText
                    className={classes.marginLeft}
                    text={
                        "Latest version published " +
                        timeSince(new Date(Date.now())) +
                        " ago."
                    }
                    icon={<BookmarkIcon />}
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
};
