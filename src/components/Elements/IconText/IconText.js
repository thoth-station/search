import React from "react";

// material-ui
import { Typography } from "@mui/material";


// react
import PropTypes from "prop-types";

/**
 * Text with an icon to the right of it.
 */
const IconText = ({ text, icon, link, ...props }) => {

    return (
        <div{...props}>
            {icon}
            <Typography href={link ? link : null} variant="body2" marginLeft>
                {text}
            </Typography>
        </div>
    );
};

export default IconText;

IconText.propTypes = {
    /** The text shown */
    text: PropTypes.string.isRequired,
    /** The icon component to be displayed */
    icon: PropTypes.node.isRequired,
    /** Optional link if text is selected */
    link: PropTypes.string,
};
