// react
import React from "react";

// material-ui
import { Box, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { Chip } from "@mui/material";
import { ImageDocumentRequestResponseSuccess } from "../../api";

export interface IImageInfo {
    imageDocument?: ImageDocumentRequestResponseSuccess;
}

type ILabels = {
    architecture: string;
    "build-date": string;
    "com.redhat.build-host": string;
    "com.redhat.component": string;
    "com.redhat.license_terms": string;
    description: string;
    "distribution-scope": string;
    "io.k8s.description": string;
    "io.k8s.display-name": string;
    "io.openshift.expose-services": string;
    "io.openshift.tags": string;
    maintainer: string;
    name: string;
    release: string;
    summary: string;
    url: string;
    "vcs-ref": string;
    "vcs-type": string;
    vendor: string;
    version: string;
};

/**
 * A metric card displaying dependency information of a single package.
 */
export const ImageInfo = ({ imageDocument }: IImageInfo) => {
    if (!imageDocument) {
        return (
            <Box data-testid="image-info-not-loaded">
                <Skeleton />
                <Skeleton />
                <Skeleton width={"60%"} />
            </Box>
        );
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant={"body1"}>
                        <b>
                            {
                                (
                                    imageDocument.result["skopeo-inspect"]
                                        .Labels as ILabels
                                )?.["io.k8s.display-name"]
                            }
                        </b>
                    </Typography>
                    <Chip
                        label={(
                            imageDocument.result["skopeo-inspect"]
                                .Labels as ILabels
                        )?.name
                            .split(":")
                            .at(-1)}
                    />
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Typography variant={"h6"} mb={1}>
                    General information
                </Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>
                    Summary
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>
                    {
                        (
                            imageDocument.result["skopeo-inspect"]
                                .Labels as ILabels
                        )?.summary
                    }
                </Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>
                    Description
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>
                    {
                        (
                            imageDocument.result["skopeo-inspect"]
                                .Labels as ILabels
                        )?.description
                    }
                </Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>
                    Provider
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>
                    {
                        (
                            imageDocument.result["skopeo-inspect"]
                                .Labels as ILabels
                        )?.vendor
                    }
                </Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>
                    Maintainer
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>
                    {
                        (
                            imageDocument.result["skopeo-inspect"]
                                .Labels as ILabels
                        )?.maintainer
                    }
                </Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>
                    Build date
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>
                    {new Date(
                        (
                            imageDocument.result["skopeo-inspect"]
                                .Labels as ILabels
                        )?.["build-date"] as string,
                    ).toLocaleDateString()}
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <Typography variant={"h6"} mb={1}>
                    Technical information
                </Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>
                    Image name
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>
                    {
                        (
                            imageDocument.result["skopeo-inspect"]
                                .Labels as ILabels
                        )?.name
                    }
                </Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>
                    Image version
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>
                    {
                        (
                            imageDocument.result["skopeo-inspect"]
                                .Labels as ILabels
                        )?.version
                    }
                </Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>
                    Architecture
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>
                    {imageDocument.result["skopeo-inspect"].Architecture}
                </Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>
                    Exposed Ports
                </Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>
                    {
                        (
                            imageDocument.result["skopeo-inspect"]
                                .Labels as ILabels
                        )?.["io.openshift.expose-services"]
                    }
                </Typography>
            </Grid>
        </Grid>
    );
};
