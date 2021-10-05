// react
import React, { useMemo } from "react";
import PropTypes from "prop-types";

// material-ui
import {
  Typography,
  Divider,
  Collapse,
  Button,
  Box,
  Grid
} from "@material-ui/core";
import { TransitionGroup } from "react-transition-group";

// local
import LoadingErrorTemplate from "components/shared/LoadingErrorTemplate";
import LicenseGroup from "./LicenseGroup";

const LicenseMetric = ({ metric, deepError }) => {
  const [more, setMore] = React.useState(false);

  const licenses = useMemo(
    () =>
      Object.entries(metric?.all ?? {}).sort((a, b) => {
        return Object.keys(b[1]).length - Object.keys(a[1]).length;
      }),
    [metric?.all]
  );

  const totalLicenses = useMemo(
    () =>
      Object.entries(metric?.all ?? {}).reduce((sum, key) => {
        return sum + Object.keys(key[1]).length;
      }, 0),
    [metric?.all]
  );

  return (
    <div>
      <Grid container>
        <Grid item xs={1}>
          <Typography variant="h6" gutterBottom>
            OSI
          </Typography>
        </Grid>
        <Grid item xs>
          <Typography variant="h6" gutterBottom>
            Dependency Licenses
          </Typography>
        </Grid>
      </Grid>

      <Divider />
      <LoadingErrorTemplate
        state={deepError ? "error" : metric?.all}
        errorText="Could not run analysis on dependencies."
      >
        <TransitionGroup>
          {licenses?.slice(0, 10).map(([key, value]) => {
            return (
              <Collapse key={key}>
                <LicenseGroup
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
                  <LicenseGroup
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
  props: PropTypes.shape({
    metric: PropTypes.shape({
      total: PropTypes.number,
      all: PropTypes.object
    }).isRequired
  })
};

export default LicenseMetric;
