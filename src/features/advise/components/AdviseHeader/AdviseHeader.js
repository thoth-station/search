// React
import React, { useMemo } from "react";

// material-ui
import {Typography, Chip, Button, Collapse} from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
// local
import IconText from "components/Elements/IconText";

// utils
import { calcTime } from "../../utils";

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
export const AdviseHeader = ({ adviseDocument }) => {
  const classes = useStyles();
  const [expandAlerts, setExpandAlerts] = React.useState(false);

  // get status of the report
  const [statusText, statusColor] = useMemo(() => {
    // if report is done
    if (adviseDocument?.report) {
      if (adviseDocument.report.ERROR) {
        return ["ERROR", "error"];
      } else {
        return ["COMPLETE", "success"];
      }
    }
    // if report is not done
    else if (adviseDocument?.status?.state) {
      return [adviseDocument.status.state.toUpperCase(), "info"];
    } else {
      return ["UNKNOWN", undefined];
    }
  }, [adviseDocument]);

  // get alerts from report
  const alerts = useMemo(() => {
        if (adviseDocument?.report) {
          return adviseDocument?.report?.stack_info
              ? adviseDocument.report.stack_info.filter(alert => {
                return alert.type === "ERROR";
              })
              : null
        }
      }, [adviseDocument]
  );


  return (
    <div>
      <Typography variant="h4">
        <b>{adviseDocument?.metadata?.document_id ?? adviseDocument?.parameters?.analysis_id}</b>
      </Typography>
      <div className={classes.linksRow}>
        <Chip label={statusText} color={statusColor} />
        <IconText
          className={classes.marginLeft}
          text={calcTime(
            adviseDocument?.status?.finished_at,
            adviseDocument?.status?.started_at,
            adviseDocument?.metadata?.datetime
          )}
          icon={<AccessTimeIcon />}
        />
      </div>
      <Typography variant={"subtitle2"}>{adviseDocument?.error}</Typography>
      {alerts?.length > 0 ? (
        <div>
          <CustomAlert info={alerts[0]} />
          <Collapse in={expandAlerts} timeout="auto" unmountOnExit>
            {alerts?.slice(1).map((info, i) => {
              return <CustomAlert key={i} info={info} className={classes.alert} />;
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
  /** the Advise document id*/
  adviseDocument: PropTypes.object.isRequired
}