// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  Divider,
  Collapse,
  Chip,
  Button,
  Box,
  Grid
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import HelpOutlineRoundedIcon from "@material-ui/icons/HelpOutlineRounded";
import { TransitionGroup } from "react-transition-group";

// local
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";
import ProgressBar from "components/Shared/ProgressBar";

const useStyles = makeStyles(theme => ({
  bar: {
    marginBottom: theme.spacing(1)
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  border: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const LicenseDisplay = ({ name, value, totalLicenses }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  return (
    <Grid container>
      <Grid item xs>
        {value._meta.isOsiApproved === null ? (
          <HelpOutlineRoundedIcon />
        ) : value._meta.isOsiApproved ? (
          <CheckRoundedIcon />
        ) : null}
      </Grid>
      <Grid item xs={11}>
        <div className={classes.flex} onClick={() => setOpen(!open)}>
          <ProgressBar
            key={name}
            value={Object.keys(value).length - 1 ?? 0}
            total={totalLicenses}
            label={name}
            className={classes.bar}
            action={open ? <ExpandLess /> : <ExpandMore />}
          />
        </div>

        <Collapse in={open} timeout="auto" unmountOnExit>
          <div className={classes.border}>
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
                    className={classes.chip}
                    color={
                      v.depth === 0
                        ? "primary"
                        : v.depth === 1
                        ? "secondary"
                        : "default"
                    }
                    label={k}
                    onClick={null}
                  />
                );
              })}
          </div>
          <Divider />
        </Collapse>
      </Grid>
    </Grid>
  );
};

const LicenseMetric = ({ metric, deepError }) => {
  const classes = useStyles();

  const [more, setMore] = React.useState(false);

  const licenses = Object.entries(metric?.all ?? {}).sort((a, b) => {
    return Object.keys(b[1]).length - Object.keys(a[1]).length;
  });

  const totalLicenses = Object.entries(metric?.all ?? {}).reduce((sum, key) => {
    return sum + Object.keys(key[1]).length;
  }, 0);

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={1}>
          <Typography variant="body2" gutterBottom>
            <b>OSI</b>
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="body2" gutterBottom>
            <b>Dependency Licenses</b>
          </Typography>
        </Grid>
      </Grid>

      <Divider />
      <LoadingErrorTemplate
        state={deepError ? "error" : metric.all}
        errorText="Could not run analysis on dependencies."
      >
        <TransitionGroup>
          {licenses.slice(0, 10).map(([key, value]) => {
            return (
              <Collapse key={key}>
                <LicenseDisplay
                  name={key}
                  value={value}
                  totalLicenses={totalLicenses}
                />
              </Collapse>
            );
          })}
        </TransitionGroup>

        <Collapse in={more} timeout="auto" unmountOnExit>
          <TransitionGroup>
            {licenses.slice(10).map(([key, value]) => {
              return (
                <Collapse key={key}>
                  <LicenseDisplay
                    name={key}
                    value={value}
                    totalLicenses={totalLicenses}
                  />
                </Collapse>
              );
            })}
          </TransitionGroup>
        </Collapse>
        <Box textAlign="center">
          <Button onClick={() => setMore(!more)} color="primary">
            {more ? "Less" : "More"}
          </Button>
        </Box>
      </LoadingErrorTemplate>
    </div>
  );
};

LicenseMetric.propTypes = {
  metric: PropTypes.shape({
    root: PropTypes.string,
    all: PropTypes.object
  }).isRequired
};

export default LicenseMetric;
