// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Divider,
  Collapse,
  Box,
  List,
  ListItem,
  ListItemText
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
  flex: {}
}));

const LicenseMetric = ({ metric, deepError }) => {
  const classes = useStyles();
  const totalLicenses = Object.keys(metric?.all ?? {}).reduce(
    (sum, key) => sum + parseFloat(metric.all[key] || 0),
    0
  );

  const [open, setOpen] = React.useState(null);

  const handleExpand = key => {
    if (open === key) {
      setOpen(null);
    } else {
      setOpen(key);
    }
  };

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
        {Object.entries(metric?.all ?? {}).map(([key, value]) => {
          return (
            <div>
              <div className={classes.flex} onClick={() => handleExpand(key)}>
                <ProgressBar
                  key={key}
                  value={Object.keys(value).length ?? 0}
                  total={totalLicenses}
                  label={key}
                  className={classes.bar}
                  action={open === key ? <ExpandLess /> : <ExpandMore />}
                />
              </div>

              <Collapse in={open === key} timeout="auto" unmountOnExit>
                <Typography variant="body2" gutterBottom>
                  Root Packages
                </Typography>
                <Divider />
                <List component="nav">
                  {Object.entries(value)
                    .filter(([k, v]) => v === 0)
                    .map(k => {
                      return (
                        <ListItem>
                          <ListItemText inset primary={k} />
                        </ListItem>
                      );
                    })}
                </List>

                <Typography variant="body2" gutterBottom>
                  Direct Dependencies
                </Typography>
                <Divider />
                <List component="nav">
                  {Object.entries(value)
                    .filter(([k, v]) => v === 1)
                    .map(k => {
                      return (
                        <ListItem>
                          <ListItemText inset primary={k} />
                        </ListItem>
                      );
                    })}
                </List>

                <Typography variant="body2" gutterBottom>
                  Indirect Dependencies
                </Typography>
                <Divider />
                <List component="nav">
                  {Object.entries(value)
                    .filter(([k, v]) => v > 1)
                    .map(k => {
                      return (
                        <ListItem>
                          <ListItemText inset primary={k} />
                        </ListItem>
                      );
                    })}
                </List>
              </Collapse>
            </div>
          );
        })}
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
