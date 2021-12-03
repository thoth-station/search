// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import {Typography, Divider, Skeleton, Box} from "@material-ui/core";

// local
import ProgressBar from "components/Elements/ProgressBar";

/**
 * A metric card that aggregates changes between the initial dependency
 * graph and the Thoth made dependency graph.
 */
export const AdviseMetric = ({ metric }) => {
  const total = metric?.added + metric?.removed + metric?.version + metric?.unchanged;

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
    <>
      <Typography variant="body2" gutterBottom>
        {metric?.build}
      </Typography>
      <Typography variant="h6" gutterBottom mt={2}>
        What Thoth Changed
      </Typography>
      <Divider mb={1} />
      <ProgressBar
        value={metric?.added ?? 0}
        total={total}
        label={"Added Packages"}
        mb={1}
      />
      <ProgressBar
        value={metric?.removed ?? 0}
        total={total}
        label={"Removed Packages"}
        mb={1}
      />
      <ProgressBar
        value={metric?.version ?? 0}
        total={total}
        label={"Version Changes"}
      />
      <Typography variant="h6" mt={3} gutterBottom>
        Noteworthy Justifications
      </Typography>
      <Divider mb={1} />
      {Object.entries(metric?.justification ?? {}).map(([key, value]) => {
        return (
          <Typography variant="body2" gutterBottom key={key}>
            {key}: {value}
          </Typography>
        );
      })}
    </>
  );
};

AdviseMetric.propTypes = {
    /** The metric object info of aggregated data */
    metric: PropTypes.shape({
        /** The number of new dependencies */
        added: PropTypes.number,
        /** The number of removed dependencies */
        removed: PropTypes.number,
        /** The number of dependencies whose version was changed*/
        version: PropTypes.number,
        /** The number of dependencies that did not change*/
        unchanged: PropTypes.number,
        /** The number Thoth justification (warnings) that were produced */
        justification: PropTypes.object,
    })
 };