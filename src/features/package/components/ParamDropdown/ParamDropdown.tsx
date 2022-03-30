import React, { useContext } from "react";
import Select from "@mui/material/Select";
import { Box, MenuItem, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SpecContext } from "features/package/routes/PackageOverview";
import { BoxTypeMap } from "@mui/material/Box/Box";

interface IParamDropdown {
    options: { value: string }[];
    type: string;
    label?: string;
    disabled?: boolean;
    props?: BoxTypeMap;
}

export const ParamDropdown = ({
    options,
    type,
    label,
    disabled,
    ...props
}: IParamDropdown) => {
    const navigate = useNavigate();
    const { specs, defaultSpecs } = useContext(SpecContext);

    const handleChange = (event: { target: { value: string } }) => {
        switch (type) {
            case "package_version":
                navigate(
                    `/package/${specs.package_name}/${event.target.value}`,
                );
                break;
            case "index_url":
                navigate(
                    `/package/${specs.package_name}/${
                        specs.package_version ?? defaultSpecs.package_version
                    }/${encodeURIComponent(event.target.value)}`,
                );
                break;
            case "os_name":
                navigate(
                    `/package/${specs.package_name}/${
                        specs.package_version ?? defaultSpecs.package_version
                    }/${encodeURIComponent(
                        specs.index_url ?? defaultSpecs.index_url ?? "",
                    )}/${event.target.value}`,
                );

                break;
            case "os_version":
                navigate(
                    `/package/${specs.package_name}/${
                        specs.package_version ?? defaultSpecs.package_version
                    }/${encodeURIComponent(
                        specs.index_url ?? defaultSpecs.index_url ?? "",
                    )}/${specs.os_name ?? defaultSpecs.os_name}/${
                        event.target.value
                    }`,
                );
                break;
            case "python_version":
                navigate(
                    `/package/${specs.package_name}/${
                        specs.package_version ?? defaultSpecs.package_version
                    }/${encodeURIComponent(
                        specs.index_url ?? defaultSpecs.index_url ?? "",
                    )}/${specs.os_name ?? defaultSpecs.os_name}/${
                        specs.os_version ?? defaultSpecs.os_version
                    }/${event.target.value}`,
                );
                break;
        }
    };

    return (
        <Box {...props}>
            <Typography variant="body2">{label}</Typography>
            <Select
                displayEmpty
                fullWidth
                value={specs[type as keyof typeof specs] ?? ""}
                onChange={handleChange}
                size="small"
                variant="outlined"
                disabled={disabled}
                renderValue={value => {
                    if (!value) {
                        return (
                            <em style={{ color: "grey" }}>
                                {defaultSpecs?.[type as keyof typeof specs] ??
                                    label}
                            </em>
                        );
                    } else {
                        return value;
                    }
                }}
            >
                <MenuItem disabled value="">
                    <em>{label}</em>
                </MenuItem>
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
