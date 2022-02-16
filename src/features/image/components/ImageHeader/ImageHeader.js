// React
import React, { useMemo } from "react";
import PropTypes from "prop-types";

// material-ui
import { Typography, Chip, Button, Collapse } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FeedRoundedIcon from "@mui/icons-material/FeedRounded";

// local
import IconText from "components/Elements/IconText";

// utils
import { calcTime } from "utils/calcTime";


/**
 * Displays basic Advise document information and
 * displays any errors, info, or warnings that came up
 * in the document generation.
 */
export const ImageHeader = ({ imageDocument, logs }) => {
    const [showLogs, setShowLogs] = React.useState(false);
    const [selectedLine, setSelectedLine] = React.useState();

    // get status of the report
    const [statusText, statusColor] = useMemo(() => {
        // if report is done
        if (imageDocument?.result) {
            if (imageDocument.result.error) {
                return ["ERROR", "error"];
            } else {
                return ["COMPLETE", "success"];
            }
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
            <div>
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
            </div>
            <Typography variant={"subtitle2"} mb={2}>
                {imageDocument?.error ?? imageDocument?.result?.error_msg}
            </Typography>
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

ImageHeader.propTypes = {
    /** the Advise document id*/
    imageDocument: PropTypes.object.isRequired,
    logs: PropTypes.string,
};
