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
  Box
} from "@material-ui/core";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";

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
    <div>
      <div className={classes.flex} onClick={() => setOpen(!open)}>
        <ProgressBar
          key={name}
          value={Object.keys(value).length ?? 0}
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
              return (
                <Chip
                  key={k}
                  className={classes.chip}
                  color={
                    v === 0 ? "primary" : v === 1 ? "secondary" : "default"
                  }
                  label={k}
                  onClick={null}
                />
              );
            })}
        </div>
        <Divider />
      </Collapse>
    </div>
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
      <Typography variant="body2" gutterBottom>
        <b>Dependency Licenses</b>
      </Typography>
      <Divider />
      <LoadingErrorTemplate
        state={deepError ? "error" : metric.all}
        errorText="Could not run analysis on dependencies."
      >
        {licenses.slice(0, 10).map(([key, value]) => {
          return (
            <LicenseDisplay
              key={key}
              name={key}
              value={value}
              totalLicenses={totalLicenses}
            />
          );
        })}

        <Collapse in={more} timeout="auto" unmountOnExit>
          {licenses.slice(10).map(([key, value]) => {
            return (
              <LicenseDisplay
                key={key}
                name={key}
                value={value}
                totalLicenses={totalLicenses}
              />
            );
          })}
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
