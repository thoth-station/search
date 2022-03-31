import React from "react";

import { ToggleButtonGroup, ToggleButton } from "@mui/material";

interface ICustomCardAction {
    /** The state variable the buttons use to control the active value */
    value: string;
    /** The callback function that runs when a button is changed */
    onChange: (event: React.MouseEvent<HTMLElement>, value: any) => void;
}
/**
 * A button group for toggling between old and new dependency graphs.
 * It takes two parameters, a callback function and a state variable.
 */
export const CustomCardAction = ({ value, onChange }: ICustomCardAction) => {
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
