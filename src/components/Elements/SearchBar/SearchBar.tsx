import React from "react";

// material ui
import {
    Typography,
    Box,
    Paper,
    InputBase,
    InputBaseProps,
} from "@mui/material";
import { SxProps } from "@mui/system";

interface IProps extends InputBaseProps {
    /** The error text or default label text */
    label?: string;
    /** callback function when textbox ENTER is pressed */
    onEnter?: () => void;
    /** helper text for the search bar */
    helpertext?: string;
    /** if there is an error or not */
    error?: boolean;
    /** icon displayed on the left of the text box */
    lefticon?: React.ReactNode;
    /** icon displayed on the right of the text box */
    righticon?: React.ReactNode;
    /** Props added to the text box */
    boxprops?: SxProps;
}

/**
 *
 */
const SearchBar = ({
    onEnter,
    label,
    helpertext,
    boxprops,
    error = false,
    lefticon,
    righticon,
    ...props
}: IProps) => {
    return (
        <Box>
            <Typography
                variant={"body1"}
                sx={{ color: error ? "error.main" : "text.secondary" }}
            >
                {label}
            </Typography>
            <Paper
                variant="outlined"
                sx={{
                    p: "8px 4px",
                    display: "flex",
                    alignItems: "center",
                    borderColor: error ? "red" : undefined,
                    paddingLeft: 2,
                    paddingRight: 2,
                    ...boxprops,
                }}
            >
                {lefticon}
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={helpertext}
                    error={error}
                    onChange={props.onChange}
                    onKeyPress={ev => {
                        if (onEnter && ev.key === "Enter") {
                            onEnter();
                            ev.preventDefault();
                        }
                    }}
                    {...props}
                />
                {righticon}
            </Paper>
        </Box>
    );
};

export default SearchBar;
