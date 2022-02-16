import { Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const VersionDropdown = ({ node }) => {
    const [open, setOpen] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const versionOptions = useMemo(() => {
        const versionOptions = {};
        const distribution = [0, 0];
        const noDup = new Set();
        node.versions.forEach(version => {
            const split = version.split(".");
            const key = split[0] + "." + (split[1] ?? "");

            if (versionOptions[key] === undefined) {
                versionOptions[key] = [];
                distribution[0] += 1;
            }
            if (!noDup.has(version)) {
                versionOptions[key].push(version);
                distribution[1] += 1;
                noDup.add(version);
            }
        });

        // check if there are too many buckets
        if (distribution[0] / distribution[1] > 0.25) {
            // merge buckets
            const buckets = Math.ceil(distribution[0] * 0.25);
            const fixedVersionOptions = {};
            let currentKey;
            Object.keys(versionOptions).forEach((key, index, array) => {
                if (index % buckets === 0) {
                    currentKey = `${key} - ${
                        array[index + buckets - 1] ?? array.at(-1)
                    }`;
                    fixedVersionOptions[currentKey] = [];
                }
                fixedVersionOptions[currentKey].push(
                    ...versionOptions[array[index]],
                );
            });
            return fixedVersionOptions;
        }

        return versionOptions;
    }, [node]);

    return (
        <div>
            <Button
                onClick={event => {
                    setOpen(node.name);
                    setAnchorEl(event.currentTarget);
                }}
                variant="outlined"
                endIcon={<KeyboardArrowDownIcon />}
            >
                {node.specifier ?? "ANY"}
            </Button>
            <Menu
                open={open === node.name}
                anchorEl={anchorEl}
                onClose={() => {
                    setOpen(undefined);
                    setAnchorEl(null);
                }}
                PaperProps={{
                    style: {
                        maxHeight: "40%",
                        maxWidth: "50%",
                    },
                }}
            >
                <MenuItem disabled={true}>
                    Select a version to navigate to:
                </MenuItem>
                <Grid container alignContent="flex-start">
                    {Object.entries(versionOptions).map(([key, value]) => {
                        return (
                            <Grid item xs key={key}>
                                <MenuItem mt={2} disabled divider>
                                    {key}
                                </MenuItem>
                                {value.map(version => {
                                    return (
                                        <MenuItem
                                            key={version}
                                            onClick={() =>
                                                navigate(
                                                    `/package/${node.name}/${version}`,
                                                )
                                            }
                                        >
                                            <Typography variant={"body2"}>
                                                {version}
                                            </Typography>
                                        </MenuItem>
                                    );
                                })}
                            </Grid>
                        );
                    })}
                </Grid>
            </Menu>
        </div>
    );
};

VersionDropdown.propTypes = {
    node: PropTypes.shape({
        name: PropTypes.string,
        versions: PropTypes.array,
        specifier: PropTypes.string,
    }),
};
