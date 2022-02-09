// react
import React, { useMemo } from "react";
import PropTypes from "prop-types";

// material-ui
import { Box, Grid, Skeleton, Stack, Typography } from "@material-ui/core";
import { Chip } from "@mui/material";

/**
 * A metric card displaying dependency information of a single package.
 */
export const ImageInfo = ({ imageDocument, imageMetadata }) => {

    const params = useMemo(() => {
        if(imageMetadata) {
            return imageMetadata
        }
        else if(imageDocument) {
            return {
                architecture: imageDocument.result["skopeo-inspect"].Architecture,
                created: imageDocument.result["skopeo-inspect"].Created,
                digest: imageDocument.result["skopeo-inspect"].Digest,
                docker_version: imageDocument.result["skopeo-inspect"].DockerVersion,
                labels: imageDocument.result["skopeo-inspect"].Labels,
                layers: imageDocument.result["skopeo-inspect"].Layers,
                os: imageDocument.result["skopeo-inspect"].Os,
                repo_tags: imageDocument.result["skopeo-inspect"].RepoTags,
            }
        }
    }, [imageDocument, imageMetadata])

    if (!imageDocument) {
        return (
            <Box>
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
                    <Typography variant={"body1"}><b>{params.labels["io.k8s.display-name"]}</b></Typography>
                    <Chip label={params.labels.name.split(":").at(-1)} />
                </Stack>
            </Grid>
            <Grid item xs={12}>
                <Typography variant={"h6"} mb={1}>General information</Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>Summary</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>{params.labels.summary}</Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>Description</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>{params.labels.description}</Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>Provider</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>{params.labels.vendor}</Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>Maintainer</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>{params.labels.maintainer}</Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>Build date</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>{new Date(params.labels["build-date"]).toLocaleDateString()}</Typography>
            </Grid>


            <Grid item xs={12}>
                <Typography variant={"h6"} mb={1}>Technical information</Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>Image name</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>{params.labels.name}</Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>Image version</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>{params.labels.version}</Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>Architecture</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>{params.architecture}</Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>Usage</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}><code>{params.labels.usage}</code></Typography>
            </Grid>

            <Grid item xs={3}>
                <Typography variant={"body2"} mr={3} ml={2} mb={1}>Exposed Ports</Typography>
            </Grid>
            <Grid item xs={9}>
                <Typography variant={"body2"}>{params.labels["io.openshift.expose-services"]}</Typography>
            </Grid>
        </Grid>
    );
};

ImageInfo.propTypes = {
    /** An object holding metric info. */
    imageDocument: PropTypes.object,
    imageMetadata: PropTypes.object
};
