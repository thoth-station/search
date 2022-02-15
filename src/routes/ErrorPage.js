import React from "react";
import PropTypes from "prop-types";

export const ErrorPage = ({message, type, reason}) => {
    return <div>
        <p>{type}{": "}{message}</p>
        <p>{reason}</p>
    </div>;
};

ErrorPage.propTypes = {
    message: PropTypes.string,
    type: PropTypes.any,
    reason: PropTypes.string,
}