// React
import React, { useMemo } from "react";

// material-ui
import { Typography, Chip, ChipProps, AlertColor, Stack, Paper } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// local
import IconText from "components/molecules/IconText";
import CustomAlert from "components/atoms/CustomAlert";

// utils
import { calcTime } from "utils/calcTime";
import { useAdviseLogs, useAdviseDocument } from "api";

/**
 * Displays basic Advise document information and
 * displays any errors, info, or warnings that came up
 * in the document generation.
 */
const AdviseHeader = ({ analysis_id }: { analysis_id: string }) => {
  const { result, status, metadata } = useAdviseDocument(analysis_id);
  const { lastLog } = useAdviseLogs(analysis_id);

  // get status of the report
  const [statusText, statusColor] = useMemo<[string, ChipProps["color"]]>(() => {
    // if report is done
    if (result) {
      if (result?.report?.ERROR || result?.error) {
        return ["ERROR", "error"];
      } else {
        return ["COMPLETE", "success"];
      }
    }
    // if report is not done
    else if (status) {
      return [(status["state"] as string)?.toUpperCase(), "info"];
    }

    return ["UNKNOWN", undefined];
  }, [result, status]);

  const time = useMemo(() => {
    let finished_at = null;
    let started_at = null;
    let datetime = null;

    if (status) {
      finished_at = status.finished_at;
      started_at = status.started_at;
    }
    if (metadata) {
      datetime = metadata.datetime;
    }

    return calcTime(finished_at, started_at, datetime);
  }, [status, metadata]);

  const errorMessage = useMemo(() => {
    let msg = "";

    if (result) {
      msg = result?.report?.ERROR ?? result?.error_msg ?? "";
    }

    return msg;
  }, [result]);

  return (
    <div>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="h5" mb={1}>
          <b>{analysis_id ?? "Unknown Adviser Run"}</b>
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip label={statusText} color={statusColor} />
          <IconText text={time} icon={<AccessTimeIcon />} />
        </Stack>
      </Paper>
      <>
        {statusText === "ERROR" ? (
          <CustomAlert
            variant="filled"
            sx={{ margin: 1, marginTop: 2 }}
            info={{
              message: errorMessage,
              type: "error",
            }}
          />
        ) : statusText !== "COMPLETE" ? (
          <CustomAlert
            variant="outlined"
            sx={{ margin: 1, marginTop: 2 }}
            info={{
              message: lastLog?.message ?? "",
              type: lastLog?.levelname?.toLowerCase() as AlertColor,
            }}
          />
        ) : undefined}
      </>
    </div>
  );
};

export default AdviseHeader;
