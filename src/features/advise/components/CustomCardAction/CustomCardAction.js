import React from "react";

import { ToggleButtonGroup, ToggleButton } from "@material-ui/core";
import PropTypes from "prop-types";

/**
 * A button group for toggling between old and new dependency graphs.
 * It takes two parameters, a callback function and a state variable.
 */
export const CustomCardAction = ({ value, onChange }) => {
    return (
        <ToggleButtonGroup
            value={value}
            exclusive
            size="small"
            onChange={onChange}
        >
            <ToggleButton value="oldGraph">Old</ToggleButton>
            <ToggleButton value="newGraph">New</ToggleButton>
        </ToggleButtonGroup>
    );
};

CustomCardAction.propTypes = {
    /** The state variable the buttons use to control the active value */
    value: PropTypes.string.isRequired,
    /** The callback function that runs when a button is changed */
    onChange: PropTypes.func.isRequired,
};
