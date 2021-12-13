import React from "react";

// material ui
import { Typography, Box, Paper, InputBase } from "@material-ui/core";

// react
import PropTypes from "prop-types";

/**
 *
 */
const SearchBar = props => {
    const {
        onChange,
        onEnter,
        label,
        helpertext,
        boxprops,
        error = false,
        lefticon,
        righticon,
    } = props;

    return (
        <Box>
            <Typography
                variant={"body1"}
                sx={{ color: error ? "error.main" : "text.secondary" }}
            >
                {label}
            </Typography>
            <Paper
                component="form"
                variant="outlined"
                sx={{
                    p: "8px 4px",
                    display: "flex",
                    alignItems: "center",
                    borderColor: error ? "red" : undefined,
                    paddingLeft: 2,
                    paddingRight: 2,
                }}
                {...boxprops}
            >
                {lefticon}
                <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder={helpertext}
                    error={error}
                    onChange={e => onChange(e.target.value)}
                    onKeyPress={ev => {
                        if (ev.key === "Enter") {
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

SearchBar.propTypes = {
    /** The error text or default label text */
    label: PropTypes.string,
    /** callback function when textbox content changes */
    onChange: PropTypes.func.isRequired,
    /** callback function when textbox ENTER is pressed */
    onEnter: PropTypes.func,
    /** helper text for the search bar */
    helpertext: PropTypes.string,
    /** if there is an error or not */
    error: PropTypes.bool,
    /** icon displayed on the left of the text box */
    lefticon: PropTypes.node,
    /** icon displayed on the right of the text box */
    righticon: PropTypes.node,
    /** Props added to the text box */
    boxprops: PropTypes.any,
};

export default SearchBar;
