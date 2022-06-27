import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

// sub-routes
import { ImageSummary } from "./ImageSummary";

// feature specific imports
import { useImageDocument, useImageLogs } from "../api";

// misc
import { CircularProgress } from "@mui/material";
import { ImageNotFound } from "./ImageNotFound";
import { NavigationLayout } from "components/Layout/NavigationLayout";
import { useGraph } from "hooks";
import { useMetrics } from "../hooks";
import { ImageHeader } from "../components";
import { formatImagePackages } from "../utils";
import { components } from "lib/schema";
import { AxiosResponse } from "axios";
import { postImageAnalyze } from "../../home/api";

export const ImageRoutes = () => {
    // get document id
    const { analysis_id } = useParams();
    const { state } = useLocation();
    const navigate = useNavigate();

    // api get thoth image analysis document
    const imageDocument = useImageDocument(analysis_id, {
        useErrorBoundary: false,
        refetchInterval: (
            data: AxiosResponse<
                components["schemas"]["AnalysisStatusResponse"]
            >,
        ) => {
            if (data?.data?.status) {
                return 10000;
            }
            return false;
        },
    });

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
                name:
                    (imageDocument.data.data.result?.["operating-system"]
                        ?.id as string) ?? "rhel",
                version:
                    (
                        imageDocument.data.data.result?.["operating-system"]
                            ?.version_id as string
                    )?.split(".")[0] ?? "8",
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
    const metrics = useMetrics(graph);

    if (imageDocument?.isLoading) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    if (!imageDocument?.data) {
        const name = (state as { image_name?: string })?.image_name;
        if (name) {
            postImageAnalyze(name).then(response => {
                navigate("/image/" + response.data.analysis_id, {
                    state: { image_name: name },
                });
            });
            return (
                <div className="w-full h-48 flex justify-center items-center">
                    <CircularProgress />
                </div>
            );
        }
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
            <NavigationLayout goHome={true}>
                <ImageHeader
                    imageDocument={imageDocument.data?.data}
                    logs={logs.data?.data?.log}
                />
                <ImageSummary
                    metrics={metrics}
                    imageDocument={imageDocument.data?.data}
                />
            </NavigationLayout>
        </div>
    );
};
