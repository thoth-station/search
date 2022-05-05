import React, { useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Collapse,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography,
} from "@mui/material";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { KeyboardArrowDown } from "@mui/icons-material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

interface IStackInfoRulesMetric {
    url: string;
    metric: {
        [key: string]: { package: string; constraint: string; index: string }[];
    };
}

export const StackInfoRulesMetric = ({
    url,
    metric,
}: IStackInfoRulesMetric) => {
    const [selected, setSelected] = useState<number | undefined>(0);
    const theme = useTheme();
    const compact = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <>
            {compact ? (
                <Card variant="outlined">
                    <CardHeader
                        title="Solver Rules"
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
                                icon={<ErrorOutlineOutlinedIcon />}
                                label={Object.keys(metric).length}
                                color="error"
                            />
                        }
                    />
                </Card>
            ) : (
                <Card variant="outlined">
                    <CardHeader
                        title="Solver Rules"
                        subheader="One or multiple packages were removed based on Python solver rules configured"
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
                        <Stack spacing={2}>
                            {Object.entries(metric).map(([rule, value], i) => {
                                return (
                                    <Box key={rule}>
                                        <Button
                                            sx={{ marginBottom: 1 }}
                                            onClick={() =>
                                                setSelected(
                                                    selected === i
                                                        ? undefined
                                                        : i,
                                                )
                                            }
                                        >
                                            <Stack direction="row" spacing={2}>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight="bolder"
                                                >
                                                    {rule}
                                                </Typography>
                                                <KeyboardArrowDown
                                                    sx={{
                                                        mr: -1,
                                                        transform:
                                                            selected === i
                                                                ? "rotate(0deg)"
                                                                : "rotate(-90deg)",
                                                        transition: "0.2s",
                                                    }}
                                                />
                                            </Stack>
                                        </Button>
                                        <Collapse in={selected === i}>
                                            <Grid
                                                container
                                                sx={{
                                                    marginLeft: 1,
                                                    paddingRight: 1,
                                                }}
                                            >
                                                <Grid item xs={5}>
                                                    <Typography variant="body2">
                                                        Package
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={2}
                                                    textAlign="center"
                                                >
                                                    <Typography variant="body2">
                                                        Constraint
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={5}
                                                    textAlign="right"
                                                >
                                                    <Typography variant="body2">
                                                        Index
                                                    </Typography>
                                                </Grid>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sx={{ marginBottom: 1 }}
                                                >
                                                    <Divider flexItem />
                                                </Grid>
                                                {value.map(pkg => {
                                                    return (
                                                        <React.Fragment
                                                            key={
                                                                pkg.package +
                                                                pkg.index
                                                            }
                                                        >
                                                            <Grid item xs={5}>
                                                                {pkg.package}
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={2}
                                                                textAlign="center"
                                                            >
                                                                {pkg.constraint}
                                                            </Grid>
                                                            <Grid
                                                                item
                                                                xs={5}
                                                                textAlign="right"
                                                            >
                                                                {pkg.index}
                                                            </Grid>
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </Grid>
                                        </Collapse>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </CardContent>
                </Card>
            )}
        </>
    );
};
