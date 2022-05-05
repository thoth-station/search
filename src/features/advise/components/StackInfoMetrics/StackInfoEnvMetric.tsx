import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    Chip,
    Grid,
    IconButton,
    Typography,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export const StackInfoEnvMetric = ({
    url,
    metric,
}: {
    url: string;
    metric: { provided: boolean; message: string }[];
}) => {
    const theme = useTheme();
    const compact = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            {compact ? (
                <Card variant="outlined">
                    <CardHeader
                        title="Environment Parameters"
                        titleTypographyProps={{
                            variant: "h6",
                        }}
                        action={
                            <IconButton
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <OpenInNewRoundedIcon />
                            </IconButton>
                        }
                        avatar={
                            <Chip
                                icon={<InfoOutlinedIcon />}
                                label={
                                    metric.filter(env => env.provided).length
                                }
                                color="info"
                            />
                        }
                    />
                </Card>
            ) : (
                <Card variant="outlined">
                    <CardHeader
                        title="Environment Parameters"
                        subheader={`The advisor input was provided with ${
                            metric.filter(env => env.provided).length
                        } environment parameters`}
                        action={
                            <IconButton
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <OpenInNewRoundedIcon />
                            </IconButton>
                        }
                    />
                    <CardContent>
                        <Grid container>
                            {metric.map(env => (
                                <React.Fragment key={env.message}>
                                    <Grid item xs={1}>
                                        {env.provided ? (
                                            <CloseRoundedIcon color="error" />
                                        ) : (
                                            <DoneRoundedIcon color="success" />
                                        )}
                                    </Grid>
                                    <Grid item xs={11}>
                                        <Typography variant="body2">
                                            {env.message}
                                        </Typography>
                                    </Grid>
                                </React.Fragment>
                            ))}
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </>
    );
};
