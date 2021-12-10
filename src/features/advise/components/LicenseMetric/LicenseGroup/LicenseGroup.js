import React from "react";

// material-ui
import { Divider, Collapse, Chip, Grid, Box } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";

// local
import ProgressBar from "components/Elements/ProgressBar";
import PropTypes from "prop-types";

/**
 * A custom list item displaying the number of packages under a particular license.
 */
const LicenseGroup = ({ name, metadata, packages, totalLicenses }) => {
	const [open, setOpen] = React.useState(false);

	return (
		<Grid container>
			<Grid item xs={1}>
				{metadata?.isOsiApproved === null ? (
					<HelpOutlineRoundedIcon />
				) : metadata?.isOsiApproved ? (
					<CheckRoundedIcon />
				) : null}
			</Grid>
			<Grid item xs>
				<Box onClick={() => setOpen(!open)}>
					<ProgressBar
						key={name}
						value={Object.keys(packages).length ?? 0}
						total={totalLicenses}
						label={name}
						action={open ? <ExpandLess /> : <ExpandMore />}
					/>
				</Box>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<Box my={1}>
						{Object.entries(packages)
							.sort((a, b) => {
								return a[1] - b[1];
							})
							.map(([k, v]) => {
								return (
									<Chip
										key={k}
										sx={{ margin: 0.5 }}
										color={
											v.depth === 0
												? "primary"
												: v.depth === 1
													? "secondary"
													: "default"
										}
										label={k}
									/>
								);
							})}
					</Box>
					<Divider />
				</Collapse>
			</Grid>
		</Grid>
	);
};

LicenseGroup.propTypes ={
	/** The license name */
	name: PropTypes.string.isRequired,
	/** License specific infomration */
	metadata: PropTypes.shape({
		/** If license is approved by OSI standards */
		isOsiApproved: PropTypes.bool
	}),
	/** The packages that use this license as an object */
	packages: PropTypes.objectOf(PropTypes.shape({
		depth: PropTypes.number.isRequired
	})).isRequired,
	/** The total number of packages that have licenses. (used to add a total to the metric bar) */
	totalLicenses: PropTypes.number.isRequired


};

export default LicenseGroup;
