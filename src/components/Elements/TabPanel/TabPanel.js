import React from "react";
import PropTypes from "prop-types";

/**
 * A tab panel used to encapsulate different tab content.
 */
const TabPanel = ({ children, value, index, ...props }) => {
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			className={`${props.className}`}
			{...props}
		>
			{value === index && children}
		</div>
	);
};

TabPanel.propTypes = {
	/** The body of the tab. */
	children: PropTypes.node,
	/** The unique identifier of the tab. */
	index: PropTypes.any.isRequired,
	/** The state variable passed in from the parent which is compared to the index */
	value: PropTypes.any.isRequired,
	/** additional styling */
	className: PropTypes.string
};

export default TabPanel;
