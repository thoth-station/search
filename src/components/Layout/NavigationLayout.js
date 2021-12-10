import * as React from "react";
import {useNavigate} from "react-router-dom";
import {Button} from "@material-ui/core";
import PropTypes from "prop-types";

/**
 * Layout is used in most of the app and allows for backwards navigation.
 */
export const NavigationLayout = ({ children }) => {
	const navigate = useNavigate();

	return (
		<>
			<Button onClick={() => navigate("/")}>go back</Button>
			<div>
				{children}
			</div>
		</>
	);
};

NavigationLayout.propTypes = {
	children: PropTypes.node
};