// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { Typography, Divider } from "@material-ui/core";

// local
import ProgressBar from "components/shared/ProgressBar";

// Shared
import LoadingErrorTemplate from "components/shared/LoadingErrorTemplate";

const AdviseMetric = ({ metric }) => {
  const total =
    metric?.added + metric?.removed + metric?.version + metric?.unchanged;

  return (
    <LoadingErrorTemplate isLoading={!metric}>
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
    </LoadingErrorTemplate>
  );
};

AdviseMetric.propTypes = {
  metric: PropTypes.shape({
    added: PropTypes.number,
    removed: PropTypes.number,
    version: PropTypes.number,
    unchanged: PropTypes.number,
    justification: PropTypes.object,
    build: PropTypes.string
  })
};

export default AdviseMetric;
