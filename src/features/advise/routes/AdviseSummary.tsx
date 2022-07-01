import React, { useState } from "react";
import { AdviseHeader } from "../components";
import {
    Box,
    Grid,
    CardContent,
    Card,
    Typography,
    CardHeader,
    Stack,
    Divider,
} from "@mui/material";
import { AdviseDocumentRequestResponseSuccess } from "../api";
import { useImportantJustifications } from "../hooks/useImportantJustifications";
import { BubbleHistogram } from "../components/SummaryCharts";
import { Link } from "react-router-dom";

interface IAdviseSummary {
    adviseDocument?: AdviseDocumentRequestResponseSuccess;
    lastLog?: { [key: string]: string };
}

export const AdviseSummary = ({ adviseDocument, lastLog }: IAdviseSummary) => {
    const summary = useImportantJustifications(adviseDocument);
    const [warningPackagesSelected, setWarningPackagesSelected] = useState<
        [string, number][]
    >([]);

    const handleClick = (pkgs: [string, number][]) => {
        setWarningPackagesSelected(pkgs);
    };

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <AdviseHeader
                        adviseDocument={adviseDocument}
                        lastLog={lastLog}
                    />
                </Grid>

                <Grid item xs={12} sm={6}>
                    <Card variant="outlined">
                        <CardHeader
                            title="Package Warnings"
                            subheader="The distribution of all package warnings"
                        />
                        <CardContent>
                            <Grid container justifyContent="center">
                                <Grid
                                    item
                                    style={{ height: "100%", width: "100%" }}
                                >
                                    <BubbleHistogram
                                        source={summary.warningPackages}
                                        handleClick={handleClick}
                                    />
                                </Grid>
                                <Grid item width={"100%"}>
                                    <Typography
                                        textAlign="center"
                                        sx={{ marginBottom: 0.5 }}
                                        variant="body1"
                                        fontStyle="italic"
                                    >
                                        {warningPackagesSelected.length > 0
                                            ? `${warningPackagesSelected.length} packages selected`
                                            : "Click and drag on the chart to select packages"}
                                    </Typography>
                                    {warningPackagesSelected.length > 0 && (
                                        <>
                                            <Stack direction="row" spacing={1}>
                                                <Typography
                                                    fontWeight="bold"
                                                    variant="body1"
                                                >
                                                    Average Warnings:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {(
                                                        warningPackagesSelected.reduce(
                                                            (p, [, c]) => p + c,
                                                            0,
                                                        ) /
                                                        warningPackagesSelected.length
                                                    ).toFixed(1)}
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1}>
                                                <Typography
                                                    fontWeight="bold"
                                                    variant="body1"
                                                >
                                                    Max Warnings:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {
                                                        warningPackagesSelected
                                                            .sort(
                                                                (
                                                                    [, a],
                                                                    [, b],
                                                                ) => a - b,
                                                            )
                                                            .at(-1)?.[1]
                                                    }
                                                </Typography>
                                            </Stack>
                                            <Stack
                                                direction="row"
                                                spacing={1}
                                                sx={{ marginBottom: 2 }}
                                            >
                                                <Typography
                                                    fontWeight="bold"
                                                    variant="body1"
                                                >
                                                    Min Warnings:
                                                </Typography>
                                                <Typography variant="body1">
                                                    {
                                                        warningPackagesSelected
                                                            .sort(
                                                                (
                                                                    [, a],
                                                                    [, b],
                                                                ) => a - b,
                                                            )
                                                            .at(0)?.[1]
                                                    }
                                                </Typography>
                                            </Stack>
                                            {Array.from(
                                                new Set(
                                                    warningPackagesSelected.map(
                                                        ([, c]) => c,
                                                    ),
                                                ).values(),
                                            )
                                                .sort()
                                                .map(count => (
                                                    <React.Fragment key={count}>
                                                        <Typography
                                                            color="gray"
                                                            variant="subtitle2"
                                                            fontStyle="italic"
                                                        >{`${count} warnings`}</Typography>
                                                        <Divider />
                                                        <Grid
                                                            container
                                                            spacing={1.5}
                                                            sx={{
                                                                marginBottom: 1,
                                                                marginLeft: 1,
                                                            }}
                                                        >
                                                            {warningPackagesSelected
                                                                .filter(
                                                                    ([, c]) =>
                                                                        c ===
                                                                        count,
                                                                )
                                                                .map(
                                                                    ([pkg]) => (
                                                                        <Grid
                                                                            key={
                                                                                pkg
                                                                            }
                                                                            item
                                                                        >
                                                                            <Link
                                                                                replace
                                                                                to={
                                                                                    "../packages/" +
                                                                                    pkg
                                                                                }
                                                                            >
                                                                                {
                                                                                    pkg
                                                                                }
                                                                            </Link>
                                                                        </Grid>
                                                                    ),
                                                                )}
                                                        </Grid>
                                                    </React.Fragment>
                                                ))}
                                        </>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};
