// React
import React, { useContext } from "react";

// material-ui
import { Typography, Chip, Button, Collapse, Alert } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
// local
import IconText from "components/Shared/IconText";

// utils
import { timeSince } from "utils/timeSince";

// redux
import { StateContext } from "App";

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

const CustomAlert = ({ info, ...props }) => {
  return (
    <Alert
      className={props.className}
      action={
        <Button color="inherit" size="small" href={info.link}>
          DETAILS
        </Button>
      }
      severity={info.type.toLowerCase()}
    >
      {info.message}
    </Alert>
  );
};

const AdviseHeader = ({ adviseID }) => {
  const classes = useStyles();
  const state = useContext(StateContext);
  const [expandAlerts, setExpandAlerts] = React.useState(false);

  const calcTime = () => {
    // if status says finished
    if (state?.advise?.status?.finished_at) {
      return (
        "Advise finished " +
        timeSince(new Date(state.advise.status.finished_at)) +
        " ago."
      );
    }
    // if status is pending
    else if (state?.advise?.status?.started_at) {
      return (
        "Advise started " +
        timeSince(new Date(state.advise.status.started_at)) +
        " ago."
      );
    }
    // if status is nulled so use metadata end date
    else if (state?.advise?.metadata?.datetime) {
      return (
        "Advise finished " +
        timeSince(new Date(state.advise.metadata.datetime + "Z")) +
        " ago."
      );
    } else {
      return "Time started/finished not available";
    }
  };

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

  const alerts = state?.advise?.report?.stack_info
    ? state.advise.report.stack_info.sort((a, b) => {
        const order = { INFO: 0, WARNING: 1, ERROR: 2 };
        return order[b.type] - order[a.type];
      })
    : null;

  return (
    <div>
      <Typography variant="h4">
        <b>{adviseID}</b>
      </Typography>
      <div className={classes.linksRow}>
        <Chip label={statusText} color={statusColor} />
        <IconText
          className={classes.marginLeft}
          text={calcTime()}
          icon={<AccessTimeIcon />}
        />
      </div>
      {state?.advise?.report?.stack_info?.length > 0 ? (
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
            {state?.advise?.report?.stack_info?.length > 1
              ? expandAlerts
                ? "LESS"
                : "MORE"
              : null}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default AdviseHeader;
