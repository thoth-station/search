import React from "react";
import PropTypes from "prop-types";

export const AdviseNotFound = ({analysis_id}) => {
	return <div>`&quot;{analysis_id}&quot;` not found</div>;
};

AdviseNotFound.propTypes = {
	analysis_id: PropTypes.string,
};