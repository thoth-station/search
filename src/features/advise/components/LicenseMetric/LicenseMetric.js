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
    Grid, Skeleton
} from "@material-ui/core";
import { TransitionGroup } from "react-transition-group";

// local
import LicenseGroup from "./LicenseGroup";

/**
 * A metric card that visualizes license data for all packages in the graph.
 */
export const LicenseMetric = ({ metric }) => {
  const [more, setMore] = React.useState(false);

  const licenses = useMemo(
    () =>
      Object.entries(metric ?? {}).sort((a, b) => {
        return Object.keys(b[1]).length - Object.keys(a[1]).length;
      }),
    [metric]
  );

  const totalLicenses = useMemo(
    () =>
      Object.entries(metric ?? {}).reduce((sum, [key, val]) => {
        return sum + Object.keys(val.packages).length;
      }, 0),
    [metric]
  );

    if(!metric) {
        return (
            <Box>
                <Skeleton />
                <Skeleton />
                <Skeleton width={"60%"}/>
            </Box>
        )
    }

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
        <TransitionGroup>
          {licenses?.slice(0, 10).map(([key, value]) => {
            return (
              <Collapse key={key}>
                <LicenseGroup
                  name={key}
                  metadata={value.metadata}
                  packages={value.packages}
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
                    metadata={value.metadata}
                    packages={value.packages}
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
    </div>
  );
};

LicenseMetric.propTypes = {
    /** Key value pairs of license names (keys) and license information (values).*/
    metric: PropTypes.objectOf(PropTypes.shape({
        metadata: PropTypes.object,
        packages: PropTypes.object.isRequired
    }))
};
