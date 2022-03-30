// React
import React, { useMemo } from "react";

// material-ui
import { Typography, Chip, Button, Collapse, Stack } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";

// local
import IconText from "components/Elements/IconText";

// utils
import { calcTime } from "utils/calcTime";
import { components } from "lib/schema";
import { ChipProps } from "@mui/material/Chip/Chip";

interface IImageHeader {
    imageDocument: components["schemas"]["AnalysisResultResponse"] &
        components["schemas"]["AnalysisStatusResponse"];
    logs?: components["schemas"]["AnalysisLogResponse"]["log"];
}

/**
 * Displays basic Advise document information and
 * displays any errors, info, or warnings that came up
 * in the document generation.
 */
export const ImageHeader = ({ imageDocument, logs }: IImageHeader) => {
    const [showLogs, setShowLogs] = React.useState(false);
    const [selectedLine, setSelectedLine] = React.useState<
        number | undefined
    >();

    // get status of the report
    const [statusText, statusColor]: [string, ChipProps["color"] | undefined] =
        useMemo(() => {
            if (imageDocument?.result) {
                return ["COMPLETE", "success"];
            }
            // if report is not done
            else if (imageDocument?.status?.state) {
                return [imageDocument.status.state.toUpperCase(), "info"];
            } else {
                return ["UNKNOWN", undefined];
            }
        }, [imageDocument]);

    return (
        <div>
            <Typography variant="h4" mb={2}>
                <b>
                    {imageDocument?.metadata?.document_id ??
                        imageDocument.parameters.analysis_id}
                </b>
            </Typography>
            <Stack direction="row" spacing={2}>
                <Chip label={statusText} color={statusColor} />
                <IconText
                    text={calcTime(
                        imageDocument?.status?.finished_at,
                        imageDocument?.status?.started_at,
                        imageDocument?.metadata?.datetime,
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
                }) ?? "Image log is not available."}
            </Collapse>
        </div>
    );
};
