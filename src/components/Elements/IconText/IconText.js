import React from "react";

// material-ui
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// react
import PropTypes from "prop-types";


const useStyles = makeStyles(() => ({
	root: {
		display: "flex",
		alignItems: "center"
	}
}));

/**
 * Text with an icon to the right of it.
 */
const IconText = ({ text, icon, link, ...props }) => {
	const classes = useStyles();
	return (
		<div className={`${classes.root} ${props.className}`}>
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
	/** additional styling */
	className: PropTypes.string
};
