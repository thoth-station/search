// React
import React, { useMemo } from "react";

// material-ui
import {
    Typography,
    Chip,
    Button,
    Collapse,
    ChipProps,
    AlertColor,
    Stack,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";

// local
import IconText from "components/Elements/IconText";
import CustomAlert from "./CustomAlert";

// utils
import { calcTime } from "utils/calcTime";
import {
    AdviseDocumentRequestParams,
    AdviseDocumentRequestResponseSuccess,
} from "../../api";

interface IAdviseHeader {
    /** the Advise document id*/
    adviseDocument?: AdviseDocumentRequestResponseSuccess;
    /** the Advise document logs*/
    logs?: string | null;
}

/**
 * Displays basic Advise document information and
 * displays any errors, info, or warnings that came up
 * in the document generation.
 */
export const AdviseHeader = ({ adviseDocument, logs }: IAdviseHeader) => {
    const [expandAlerts, setExpandAlerts] = React.useState<boolean>(false);
    const [showLogs, setShowLogs] = React.useState<boolean>(false);
    const [selectedLine, setSelectedLine] = React.useState<number>();

    // get status of the report
    const [statusText, statusColor] = useMemo<
        [string, ChipProps["color"]]
    >(() => {
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

    // get alerts from report
    const alerts = useMemo(() => {
        if (adviseDocument?.result?.report?.stack_info) {
            return adviseDocument?.result?.report.stack_info
                .filter(alert => alert.type === "ERROR")
                .map(alert => {
                    return {
                        ...alert,
                        type: alert.type.toLowerCase() as AlertColor,
                    };
                });
        } else {
            return [];
        }
    }, [adviseDocument]);

    return (
        <div>
            <Typography variant="h4" mb={1}>
                <b>
                    {adviseDocument?.metadata?.document_id ??
                        (
                            adviseDocument?.parameters as AdviseDocumentRequestParams
                        )?.analysis_id}
                </b>
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" mb={3}>
                <Chip label={statusText} color={statusColor} />
                <IconText
                    text={calcTime(
                        adviseDocument?.status?.finished_at,
                        adviseDocument?.status?.started_at,
                        adviseDocument?.metadata?.datetime,
                    )}
                    icon={<AccessTimeIcon />}
                />
                <Button
                    sx={{ marginLeft: 2 }}
                    onClick={() => setShowLogs(!showLogs)}
                >
                    <IconText text="Logs" icon={<FeedRoundedIcon />} />
                </Button>
            </Stack>
            <Collapse in={showLogs}>
                {logs?.split("\n").map((line, i) => {
                    return (
                        <Typography
                            key={i}
                            noWrap={selectedLine !== i}
                            onClick={() =>
                                setSelectedLine(
                                    selectedLine === i ? undefined : i,
                                )
                            }
                            variant="body2"
                            sx={{
                                backgroundColor:
                                    selectedLine === i
                                        ? "lightyellow"
                                        : i % 2 === 0
                                        ? "lightgray"
                                        : "unset",
                            }}
                        >
                            {line}
                        </Typography>
                    );
                }) ?? "Advisor log is not available."}
            </Collapse>
            <Typography variant={"subtitle2"} mb={2}>
                {adviseDocument?.result?.report?.ERROR ??
                    adviseDocument?.result?.error_msg}
            </Typography>
            {alerts?.length > 0 ? (
                <Stack direction="column" spacing={1}>
                    <CustomAlert info={alerts[0]} />
                    <Collapse in={expandAlerts} timeout="auto" unmountOnExit>
                        <Stack direction="column" spacing={1}>
                            {alerts?.slice(1).map((info, i) => {
                                return <CustomAlert key={i} info={info} />;
                            })}
                        </Stack>
                    </Collapse>

                    <Button
                        color="inherit"
                        size="small"
                        sx={{ alignSelf: "flex-start" }}
                        onClick={() => setExpandAlerts(!expandAlerts)}
                    >
                        {alerts?.length > 1
                            ? expandAlerts
                                ? "LESS"
                                : "MORE"
                            : null}
                    </Button>
                </Stack>
            ) : null}

            {statusText === "COMPLETE" ? (
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                    Thoth has added and removed packages from the original
                    Pipfile.lock, resulting in a <i>new</i> Pipfile.lock. Switch
                    between the new and old Python environments to see the
                    differences.
                </Typography>
            ) : null}
        </div>
    );
};
