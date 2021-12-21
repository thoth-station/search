import React, { useContext } from "react";
import Select from "@mui/material/Select";
import { Box, MenuItem } from "@material-ui/core";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { SpecContext } from "features/package/routes/PackageOverview";

export const VersionDropdown = ({ options, type, label, ...props }) => {
    const navigate = useNavigate();
    const specs = useContext(SpecContext);

    const handleChange = event => {
        switch (type) {
            case "package_version":
                navigate(
                    `/package/${specs.package_name}/${event.target.value}`,
                    { replace: true },
                );
                break;
            case "os_name":
                navigate(
                    `/package/${specs.package_name}/${specs.package_version}/${event.target.value}`,
                    { replace: true },
                );
                break;
            case "os_version":
                navigate(
                    `/package/${specs.package_name}/${specs.package_version}/${specs.os_name}/${event.target.value}`,
                    { replace: true },
                );

                break;
            case "index_url":
                navigate(
                    `/package/${specs.package_name}/${specs.package_version}/${specs.os_name}/${specs.os_version}/${event.target.value}`,
                    { replace: true },
                );
                break;
        }
    };

    return (
        <Box {...props}>
            <Select
                id="selector"
                displayEmpty
                value={specs[type] ?? ""}
                label={label}
                onChange={handleChange}
                size="small"
                variant="standard"
            >
                {options.map(option => {
                    return (
                        <MenuItem key={option.value} value={option.value}>
                            {option.value}
                        </MenuItem>
                    );
                })}
            </Select>
        </Box>
    );
};

VersionDropdown.propTypes = {
    options: PropTypes.array.isRequired,
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    props: PropTypes.any,
};
