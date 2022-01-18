import { Button, Grid, Menu, MenuItem, Typography } from "@material-ui/core";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

export const VersionDropdown = ({node}) => {
    const [open, setOpen] = React.useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const navigate = useNavigate();

    const versionOptions = useMemo(() => {
        const versionOptions = {}
        node.versions.forEach(version => {
            const split = version.split(".")
            const key = split[0] + "." + split[1]

            if(versionOptions[key] === undefined) {
                versionOptions[key] = []
            }
            versionOptions[key].push(version)
        })
        return versionOptions
    }, [node])

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
                    setOpen(undefined)
                    setAnchorEl(null);
                }}
                PaperProps={{
                    style: {
                        maxHeight: "40%",
                        maxWidth: "50%"
                    },
                }}
            >
                <MenuItem disabled={true}>Select a version to navigate to:</MenuItem>
                <Grid container alignContent="flex-start">
                    {Object.entries(versionOptions).map(([key, value]) => {
                        return(
                            <Grid item xs key={key}>
                                <MenuItem mt={2} disabled divider>{`${key}.*`}</MenuItem>
                                {value.map(version => {
                                    return (
                                        <MenuItem key={version} onClick={() => navigate(
                                            `/package/${node.name}/${version}`)}>
                                            <Typography variant={"body2"}>{version}</Typography>
                                        </MenuItem>
                                    )
                                })}
                            </Grid>
                        )
                    })}
                </Grid>
            </Menu>
        </div>
    )
}

VersionDropdown.propTypes = {
    node: PropTypes.shape({
        name: PropTypes.string,
        versions: PropTypes.array,
        specifier: PropTypes.string
    })
}