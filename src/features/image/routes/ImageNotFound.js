import React from "react";
import PropTypes from "prop-types";

export const ImageNotFound = ({ analysis_id }) => {
    return <div> &quot;{analysis_id}&quot; not found</div>;
};

ImageNotFound.propTypes = {
    analysis_id: PropTypes.string,
};
