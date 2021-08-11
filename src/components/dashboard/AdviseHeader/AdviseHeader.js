// React
import React, { useContext, useMemo } from "react";

// material-ui
import { Typography, Chip, Button, Collapse } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
// local
import IconText from "components/shared/IconText";

// utils
import { calcTime } from "./utils";

// redux
import { StateContext } from "App";

// local
import CustomAlert from "./CustomAlert";

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

const AdviseHeader = ({ adviseID }) => {
  const classes = useStyles();
  const state = useContext(StateContext);
  const [expandAlerts, setExpandAlerts] = React.useState(false);

  const [statusText, statusColor] = (() => {
    // if report is done
    if (state?.advise?.report) {
      if (state.advise.report.ERROR) {
        return ["ERROR", "error"];
      } else {
        return ["COMPLETE", "success"];
      }
    }
    // if report is not done
    else if (state?.advise?.status?.state) {
      return [state.advise.status.state.toUpperCase(), "info"];
    } else {
      return ["UNKNOWN", undefined];
    }
  })();

  const alerts = useMemo(
    () =>
      state?.advise?.report?.stack_info
        ? state.advise.report.stack_info.filter(alert => {
            return alert.type === "ERROR";
          })
        : null,
    [state?.advise?.report?.stack_info]
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
            state?.advise?.status?.finished_at,
            state?.advise?.status?.started_at,
            state?.advise?.metadata?.datetime
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
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Thoth has added and removed packages from the original Pipfile.lock,
          resulting in a <i>new</i> Pipfile.lock. Switch between the new and old
          Python environments to see the differences.
        </Typography>
      ) : null}
    </div>
  );
};

export default AdviseHeader;
