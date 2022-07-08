// React
import React, { useMemo } from "react";

// material-ui
import { Typography, Chip, ChipProps, AlertColor, Stack, Paper } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// local
import IconText from "components/Elements/IconText";
import CustomAlert from "./CustomAlert";

// utils
import { calcTime } from "utils/calcTime";
import { AdviseDocumentRequestParams, AdviseDocumentRequestResponseSuccess } from "../../api";

interface IAdviseHeader {
  /** the Advise document id*/
  adviseDocument?: AdviseDocumentRequestResponseSuccess;
  /** the Advise document logs*/
  lastLog?: { [key: string]: string };
}

/**
 * Displays basic Advise document information and
 * displays any errors, info, or warnings that came up
 * in the document generation.
 */
export const AdviseHeader = ({ adviseDocument, lastLog }: IAdviseHeader) => {
  // get status of the report
  const [statusText, statusColor] = useMemo<[string, ChipProps["color"]]>(() => {
    // if report is done
    if (adviseDocument?.result?.report) {
      if (adviseDocument.result.report.ERROR) {
        return ["ERROR", "error"];
      } else {
        return ["COMPLETE", "success"];
      }
    } else if (adviseDocument?.result?.error) {
      return ["ERROR", "error"];
    }
    // if report is not done
    else if (adviseDocument?.status?.state) {
      return [adviseDocument.status.state.toUpperCase(), "info"];
    } else {
      return ["UNKNOWN", undefined];
    }
  }, [adviseDocument]);

  return (
    <>
      <Paper variant="outlined" sx={{ padding: 2 }}>
        <Typography variant="h5" mb={1}>
          <b>
            {adviseDocument?.metadata?.document_id ??
              (adviseDocument?.parameters as AdviseDocumentRequestParams)?.analysis_id}
          </b>
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip label={statusText} color={statusColor} />
          <IconText
            text={calcTime(
              adviseDocument?.status?.finished_at,
              adviseDocument?.status?.started_at,
              adviseDocument?.metadata?.datetime,
            )}
            icon={<AccessTimeIcon />}
          />
        </Stack>
      </Paper>
      <>
        {statusText === "ERROR" ? (
          <CustomAlert
            variant="filled"
            sx={{ margin: 1, marginTop: 2 }}
            info={{
              message: adviseDocument?.result?.report?.ERROR ?? adviseDocument?.result?.error_msg ?? "",
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
    </>
  );
};
