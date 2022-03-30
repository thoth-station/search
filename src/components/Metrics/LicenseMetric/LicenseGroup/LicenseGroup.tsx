import React from "react";

// material-ui
import { Divider, Collapse, Chip, Grid, Box } from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import HelpOutlineRoundedIcon from "@mui/icons-material/HelpOutlineRounded";

// local
import ProgressBar from "components/Elements/ProgressBar";
import { LicenseMetricType } from "hooks/metrics";

interface ILicenseGroup {
    /** The license name */
    name: string;
    metadata: LicenseMetricType[keyof LicenseMetricType]["metadata"];
    packages: LicenseMetricType[keyof LicenseMetricType]["packages"];
    /** The total number of packages that have licenses. (used to add a total to the metric bar) */
    totalLicenses: number;
}

/**
 * A custom list item displaying the number of packages under a particular license.
 */
const LicenseGroup = ({
    name,
    metadata,
    packages,
    totalLicenses,
}: ILicenseGroup) => {
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
                                return a[1].depth - b[1].depth;
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

export default LicenseGroup;
