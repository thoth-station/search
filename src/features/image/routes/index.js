import React, { useMemo } from "react";
import { useLocation, useParams } from "react-router-dom";

// layouts

// sub-routes
import { ImageSummary } from "./ImageSummary";

// feature specific imports
import { useImageDocument, useImageLogs, useImageMetadata } from "../api";

// misc
import { CircularProgress } from "@material-ui/core";
import { ImageNotFound } from "./ImageNotFound";
import { NavigationLayout } from "components/Layout/NavigationLayout";
import { useGraph } from "hooks";
import { useMetrics } from "../hooks";
import { ImageHeader } from "../components";
import { formatImagePackages } from "../utils";

export const ImageRoutes = () => {
    // get document id
    const { analysis_id } = useParams();
    const { state } = useLocation();

    // api get thoth image analysis document
    const imageDocument = useImageDocument(analysis_id, {
        useErrorBoundary: false,
        refetchInterval: data => {
            if (data?.data?.status) {
                return 10000;
            }
            return false;
        },
    });

    const imageMetadata = useImageMetadata(
        state?.image_name ??
            imageDocument.data?.data?.metadata?.arguments?.["extract-image"]
                ?.image,
    );

    const logs = useImageLogs(analysis_id, {
        useErrorBoundary: false,
        refetchInterval: () => {
            if (imageDocument.data?.data?.status) {
                return 10000;
            }
            return false;
        },
    });
    // format init graph data
    const graphData = useMemo(() => {
        if (imageDocument.data?.data?.metadata) {
            const os = {
                name: imageDocument.data.data.result?.["operating-system"]?.id ?? "rhel",
                version: imageDocument.data.data.result?.["operating-system"]?.version_id?.split(".")[0] ?? "8",
                python_version:
                    imageDocument.data.data.metadata.python.major +
                    "." +
                    imageDocument.data.data.metadata.python.minor,
            };
            return formatImagePackages(
                imageDocument.data.data.result["python-packages"],
                os,
            );
        }
    }, [imageDocument.data]);

    // create init graph
    const graph = useGraph(graphData);

    // compute metric data
    const metrics = useMetrics(graph, imageDocument.data?.data);

    if (imageDocument?.isLoading) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    if (!imageDocument?.data) {
        return (
            <div data-testid="image-not-loaded">
                <NavigationLayout>
                    <ImageNotFound analysis_id={analysis_id} />
                </NavigationLayout>
            </div>
        );
    }

    return (
        <div data-testid="image-loaded">
            <NavigationLayout>
                <ImageHeader
                    imageDocument={imageDocument.data?.data}
                    logs={logs.data?.data?.log}
                />
                <ImageSummary
                    imageMetadata={imageMetadata.data?.data}
                    metrics={metrics}
                    imageDocument={imageDocument.data?.data}
                />
            </NavigationLayout>
        </div>
    );
};
