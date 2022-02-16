import React from "react";
import { Button, Alert } from "@mui/material";
import PropTypes from "prop-types";

/**
 * A custom alert card.
 */
const CustomAlert = ({ info, ...props }) => {
    return (
        <Alert
            action={
                <Button color="inherit" size="small" href={info?.link}>
                    DETAILS
                </Button>
            }
            severity={info.type.toLowerCase()}
            {...props}
        >
            {info?.message}
        </Alert>
    );
};

CustomAlert.propTypes = {
    /** The alert content. */
    info: PropTypes.shape({
        /** Link to navigate to if alert is actioned on. */
        link: PropTypes.string.isRequired,
        /** Text displayed in the alert. */
        message: PropTypes.string.isRequired,
        /** Severity (color) of alert: `["ERROR", "WARNING", "INFO", "SUCCESS"]`. */
        type: PropTypes.oneOf(["ERROR", "WARNING", "INFO", "SUCCESS"])
            .isRequired,
    }).isRequired,
};

export default CustomAlert;
