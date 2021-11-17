// React
import React, { useMemo } from "react";

// material-ui
import { Typography, Chip, Button, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
// local
import IconText from "components/shared/IconText";

// utils
import { calcTime } from "./utils";

// local
import CustomAlert from "./CustomAlert";
import PropTypes from "prop-types";

// component styling

const useStyles = makeStyles(theme => ({
  titleRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1)
  },
  marginLeft: {
    marginLeft: theme.spacing(2)
  },
  marginRight: {
    marginRight: theme.spacing(2)
  },
  linksRow: {
    display: "flex",
    marginBottom: theme.spacing(3),
    alignItems: "center"
  },
  alert: {
    width: "100%",
    marginTop: theme.spacing(1)
  }
}));

/**
 * Displays basic Advise document information and
 * displays any errors, info, or warnings that came up
 * in the document generation.
 */
const AdviseHeader = ({ adviseID, adviseReport }) => {
  const classes = useStyles();
  const [expandAlerts, setExpandAlerts] = React.useState(false);

  const [statusText, statusColor] = (() => {
    // if report is done
    if (adviseReport?.report) {
      if (adviseReport.report.ERROR) {
        return ["ERROR", "error"];
      } else {
        return ["COMPLETE", "success"];
      }
    }
    // if report is not done
    else if (adviseReport?.status?.state) {
      return [adviseReport.status.state.toUpperCase(), "info"];
    } else {
      return ["UNKNOWN", undefined];
    }
  })();

  const alerts = useMemo(
    () =>
      adviseReport?.report?.stack_info
        ? adviseReport.report.stack_info.filter(alert => {
            return alert.type === "ERROR";
          })
        : null,
    [adviseReport?.report?.stack_info]
  );

  return (
    <div>
      <Typography variant="h4">
        <b>{adviseID}</b>
      </Typography>
      <div className={classes.linksRow}>
        <Chip label={statusText} color={statusColor} />
        <IconText
          className={classes.marginLeft}
          text={calcTime(
            adviseReport?.status?.finished_at,
            adviseReport?.status?.started_at,
            adviseReport?.metadata?.datetime
          )}
          icon={<AccessTimeIcon />}
        />
      </div>
      {alerts?.length > 0 ? (
        <div>
          <CustomAlert info={alerts[0]} />
          <Collapse in={expandAlerts} timeout="auto" unmountOnExit>
            {alerts?.slice(1).map(info => {
              return <CustomAlert info={info} className={classes.alert} />;
            })}
          </Collapse>

          <Button
            color="inherit"
            size="small"
            onClick={() => setExpandAlerts(!expandAlerts)}
          >
            {alerts?.length > 1 ? (expandAlerts ? "LESS" : "MORE") : null}
          </Button>
        </div>
      ) : null}

      {statusText === "COMPLETE" ? (
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Thoth has added and removed packages from the original Pipfile.lock,
          resulting in a <i>new</i> Pipfile.lock. Switch between the new and old
          Python environments to see the differences.
        </Typography>
      ) : null}
    </div>
  );
};

AdviseHeader.propTypes = {
  adviseID: PropTypes.string.isRequired,
  adviseReport: PropTypes.object
}

export default AdviseHeader;
