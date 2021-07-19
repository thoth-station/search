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
    marginBottom: theme.spacing(3)
  },
  alerts: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2)
    }
  }
}));

const PackageHeader = ({ adviseID }) => {
  const classes = useStyles();
  const state = useContext(StateContext);
  const [expandAlerts, setExpandAlerts] = React.useState(false);

  const calcTime = () => {
    if (state?.advise?.metadata) {
      return (
        "Advise finished " +
        timeSince(new Date(state?.advise?.metadata.datetime)) +
        " ago."
      );
    } else if (state?.advise?.status) {
      return (
        "Advise started " +
        timeSince(new Date(state?.advise?.status.started_at)) +
        " ago."
      );
    } else {
      return null;
    }
  };

  return (
    <div>
      <Typography variant="h4">
        <b>{adviseID}</b>
      </Typography>
      <div className={classes.linksRow}>
        <Chip
          label={
            state?.advise?.error
              ? "ERROR"
              : state?.advise?.report
              ? "DONE"
              : state?.advise?.status.state
          }
          color="secondary"
        />
        <IconText
          className={classes.marginLeft}
          text={calcTime()}
          icon={<AccessTimeIcon />}
        />
      </div>
      <div className={classes.alerts}>
        <Collapse in={expandAlerts} timeout="auto" unmountOnExit>
          {state?.advise?.report.stack_info
            ? state?.advise?.report.stack_info.map(info => {
                return (
                  <Alert
                    action={
                      <Button color="inherit" size="small" href={info.link}>
                        MORE
                      </Button>
                    }
                    severity={info.type.toLowerCase()}
                  >
                    {info.message}
                  </Alert>
                );
              })
            : null}
        </Collapse>

        <Button
          color="inherit"
          size="small"
          onClick={() => setExpandAlerts(!expandAlerts)}
        >
          {expandAlerts ? "LESS" : "MORE"}
        </Button>
      </div>
    </div>
  );
};

export default PackageHeader;
