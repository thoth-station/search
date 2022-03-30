import { Button, Grid, Menu, MenuItem, Typography } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface IVersionDropdown {
    node: {
        name: string;
        versions: string[];
        specifier: string;
    };
}

export const VersionDropdown = ({ node }: IVersionDropdown) => {
    const [open, setOpen] = React.useState<string | null | undefined>(null);
    const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);
    const navigate = useNavigate();

    const versionOptions = useMemo(() => {
        const options: { [key: string]: string[] } = {};
        const distribution = [0, 0];
        const noDup = new Set();
        node.versions.forEach(version => {
            const split = version.split(".");
            const key = split[0] + "." + (split[1] ?? "");

            if (options[key] === undefined) {
                options[key] = [];
                distribution[0] += 1;
            }
            if (!noDup.has(version)) {
                options[key].push(version);
                distribution[1] += 1;
                noDup.add(version);
            }
        });

        // check if there are too many buckets
        if (distribution[0] / distribution[1] > 0.25) {
            // merge buckets
            const buckets = Math.ceil(distribution[0] * 0.25);
            const fixedOptions: { [key: string]: string[] } = {};
            let currentKey: string;
            Object.keys(options).forEach((key, index, array) => {
                if (index % buckets === 0) {
                    currentKey = `${key} - ${
                        array[index + buckets - 1] ?? array.at(-1)
                    }`;
                    fixedOptions[currentKey] = [];
                }
                fixedOptions[currentKey].push(...options[array[index]]);
            });
            return fixedOptions;
        }

        return options;
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
                                <MenuItem sx={{ mt: 2 }} disabled divider>
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
