// react
import React from "react";
import PropTypes from "prop-types";

// local
import ProgressBar from "components/shared/ProgressBar";

// Shared
import LoadingErrorTemplate from "components/shared/LoadingErrorTemplate";

// material-ui
import { TransitionGroup } from "react-transition-group";

import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Grid,
  Collapse
} from "@material-ui/core/";

const DependenciesMetric = ({ metric }) => {
  const totalDependencies =
    (metric?.all?.direct ?? 0) +
    (metric?.all?.indirect ?? 0) +
    (metric?.all?.roots ?? 0);

  return (
    <LoadingErrorTemplate isLoading={!metric}>
      <Typography variant="body2" gutterBottom>
        <b>All Packages</b>
      </Typography>
      <Divider mb={1} />
      <ProgressBar
        value={metric?.all?.roots ?? 0}
        total={totalDependencies}
        label={"Root"}
        mb={1}
      />
      <ProgressBar
        value={metric?.all?.direct ?? 0}
        total={totalDependencies}
        label={"Direct"}
        mb={1}
      />
      <ProgressBar
        value={metric?.all?.indirect ?? 0}
        total={totalDependencies}
        label={"Indirect"}
      />
      <Typography variant="body2" gutterBottom mt={2}>
        <b>Root Packages</b>
      </Typography>
      <Divider mb={1} />
      <List component="nav">
        <TransitionGroup>
          {Object.entries(metric?.roots ?? {})?.map(([key, value], i) => {
            const t =
              (metric.roots[key].direct ?? 0) +
              (metric.roots[key].indirect ?? 0);
            return (
              <Collapse key={key}>
                <div>
                  <ListItem>
                    <Grid container alignItems="center">
                      <Grid item xs>
                        <ListItemText primary={key} />
                      </Grid>
                      <Grid item xs>
                        <Grid container direction="column">
                          <Grid item xs>
                            <ProgressBar
                              value={metric?.roots?.[key]?.direct ?? 0}
                              total={t}
                              label={"Direct"}
                            />
                          </Grid>
                          <Grid item xs>
                            <ProgressBar
                              value={metric?.roots?.[key]?.indirect ?? 0}
                              total={t}
                              label={"Indirect"}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <Divider variant={"middle"} mb={1} />
                </div>
              </Collapse>
            );
          })}
        </TransitionGroup>
      </List>
    </LoadingErrorTemplate>
  );
};

DependenciesMetric.propTypes = {
  metric: PropTypes.shape({
    all: PropTypes.shape({
      direct: PropTypes.number,
      indirect: PropTypes.number,
      roots: PropTypes.number
    })
  })
};

export default DependenciesMetric;
