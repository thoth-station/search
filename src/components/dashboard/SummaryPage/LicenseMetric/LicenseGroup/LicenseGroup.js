import React from "react";

// material-ui
import { Divider, Collapse, Chip, Grid, Box } from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";

// local
import ProgressBar from "components/shared/ProgressBar";

const LicenseGroup = ({ name, value, totalLicenses }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Grid container>
      <Grid item xs={1}>
        {value._meta.isOsiApproved === null ? (
          <HelpOutlineRoundedIcon />
        ) : value._meta.isOsiApproved ? (
          <CheckRoundedIcon />
        ) : null}
      </Grid>
      <Grid item xs>
        <Box onClick={() => setOpen(!open)}>
          <ProgressBar
            key={name}
            value={Object.keys(value).length - 1 ?? 0}
            total={totalLicenses}
            label={name}
            action={open ? <ExpandLess /> : <ExpandMore />}
          />
        </Box>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box my={1}>
            {Object.entries(value)
              .sort((a, b) => {
                return a[1] - b[1];
              })
              .map(([k, v]) => {
                if (k[0] === "_") {
                  return null;
                }
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
