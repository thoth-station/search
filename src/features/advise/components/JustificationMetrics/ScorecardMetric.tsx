import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Collapse,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

import DoneRoundedIcon from "@mui/icons-material/DoneRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { KeyboardArrowDown } from "@mui/icons-material";

type ScoreCardItemProp = {
    tags: string;
    name: string;
    short: string;
    risk: string;
    passing?: boolean;
    justification?: string;
};

const ScorecardItem = ({
    tags,
    name,
    short,
    risk,
    passing,
    justification,
}: ScoreCardItemProp) => {
    const [selected, setSelected] = useState(false);

    return (
        <Box>
            <Grid
                container
                alignItems="center"
                sx={{
                    backgroundColor: selected
                        ? "action.selected"
                        : undefined,
                    borderRadius: "16px",
                }}
            >
                <Grid item xs={11}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton onClick={() => setSelected(!selected)}>
                            <KeyboardArrowDown
                                sx={{
                                    mr: -1,
                                    transform: selected
                                        ? "rotate(0deg)"
                                        : "rotate(-90deg)",
                                    transition: "0.2s",
                                }}
                            />
                        </IconButton>
                        <Typography variant="body1" fontWeight="bolder">
                            {name}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item xs={1}>
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        sx={{ marginRight: 2 }}
                    >
                        {!passing ? (
                            <CloseRoundedIcon color="error" />
                        ) : (
                            <DoneRoundedIcon color="success" />
                        )}
                    </Box>
                </Grid>
            </Grid>
            <Collapse in={selected}>
                <Grid
                    container
                    sx={{ marginLeft: 5, marginBottom: 1, paddingRight: 1 }}
                >
                    <Grid item xs={12} sx={{ marginBottom: 2 }}>
                        <Typography variant="body2">{short}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography fontWeight="bolder" variant="body2">
                            Reason
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: 1 }}>
                        <Typography variant="body2">{justification}</Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ marginBottom: 1 }}>
                        <Stack alignItems="center" direction="row" spacing={1}>
                            <Typography variant="body2">risk: </Typography>
                            <Chip
                                size="small"
                                label={risk}
                                color={
                                    risk === "High"
                                        ? "error"
                                        : risk == "Medium"
                                        ? "warning"
                                        : "info"
                                }
                            />
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <Stack alignItems="center" direction="row" spacing={1}>
                            <Typography variant="body2">tags: </Typography>
                            {tags.split(", ").map(tag => {
                                return (
                                    <Chip size="small" key={tag} label={tag} />
                                );
                            })}
                        </Stack>
                    </Grid>
                </Grid>
            </Collapse>
        </Box>
    );
};

export const ScorecardMetric = ({
    metric,
}: {
    metric: {
        tags: string;
        name: string;
        short: string;
        risk: string;
        passing?: boolean;
        justification?: string;
    }[];
}) => {
    return (
        <Card variant="outlined"
            sx={{ marginTop: 2, }}
        >
            <CardHeader
                title="Security Scorecards"
                subheader={`Scorecards give consumers of open-source projects an easy way to judge whether their dependencies are safe.`}
                action={
                    <IconButton
                        href={
                            "https://github.com/ossf/scorecard/blob/main/docs/checks.md"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <OpenInNewRoundedIcon />
                    </IconButton>
                }
            />
            <CardContent>
                <Stack>
                    {Object.values(metric).map(value => {
                        return <ScorecardItem key={value.name} {...value} />;
                    })}
                </Stack>
            </CardContent>
        </Card>
    );
};
