import React, { useMemo } from "react";
import { Route, Routes, useParams, Navigate } from "react-router-dom";

// layouts
import { AdviseLayout } from "components/Layout";

// sub-routes
import { AdviseSummary } from "./AdviseSummary";
import { AdviseDetails } from "./AdviseDetails";

// feature specific imports
import { useAdviseDocument, useAdviseLogs } from "../api";
import { formatLockfile } from "utils/formatLockfile";
import { AdviseHeader } from "../components";
import { useMergeGraphs, useMetrics } from "../hooks";
import { useGraph} from "hooks";

// misc
import { CircularProgress } from "@material-ui/core";
import { AdviseNotFound } from "./AdviseNotFound";
import { NavigationLayout } from "components/Layout/NavigationLayout";

export const AdviseRoutes = () => {
    // get document id
    const { analysis_id } = useParams();

    // api get thoth advise document
    const adviseDocument = useAdviseDocument(analysis_id, {
        useErrorBoundary: false,
        refetchInterval: data => {
            if (data?.data?.status) {
                return 10000;
            }
            return false;
        },
    });

    const logs = useAdviseLogs(analysis_id, {
        useErrorBoundary: false,
        refetchInterval: () => {
            if (adviseDocument.data?.data?.status) {
                return 10000;
            }
            return false;
        },
    });
    // format init graph data
    const initGraphData = useMemo(() => {
        if (
            adviseDocument.isSuccess &&
            adviseDocument.data.data?.result?.parameters?.project
        ) {
            return formatLockfile(
                adviseDocument.data.data.result.parameters.project,
            );
        }
    }, [adviseDocument]);

    // format advise graph data
    const adviseGraphData = useMemo(() => {
        if (
            adviseDocument.isSuccess &&
            adviseDocument.data.data?.result?.report?.products?.[0]?.project
        ) {
            return formatLockfile(
                adviseDocument.data.data.result.report.products[0].project,
            );
        }
    }, [adviseDocument]);

    // create init graph
    const initGraph = useGraph(
        initGraphData ?? [],
        adviseDocument.data?.data?.result?.parameters?.project?.requirements
            ?.packages,
    );
    const adviseGraph = useGraph(
        adviseGraphData ?? [],
        adviseDocument.data?.data?.result?.report?.products?.[0]?.project
            ?.requirements,
    );

    // merge graphs based on added, removed, changed packages
    const mergedGraph = useMergeGraphs(
        initGraph,
        adviseGraph,
        adviseDocument.data?.data,
    );

    // compute metric data
    const metrics = useMetrics(
        initGraph,
        adviseGraph,
        mergedGraph,
        adviseDocument.data?.data,
    );

    if (adviseDocument.isLoading) {
        return (
            <div className="w-full h-48 flex justify-center items-center">
                <CircularProgress />
            </div>
        );
    }

    if (!adviseDocument.data) {
        return (
            <NavigationLayout>
                <AdviseNotFound analysis_id={analysis_id} />
            </NavigationLayout>
        );
    }

    return (
        <NavigationLayout>
            <AdviseLayout
                header={
                    <AdviseHeader
                        adviseDocument={adviseDocument.data.data}
                        logs={logs.data?.data?.log}
                    />
                }
            >
                <Routes>
                    <Route
                        path="summary"
                        element={<AdviseSummary metrics={metrics} />}
                    />
                    <Route
                        path="details"
                        element={<AdviseDetails mergedGraph={mergedGraph} />}
                    />
                    <Route path="*" element={<Navigate to="summary" />} />
                </Routes>
            </AdviseLayout>
        </NavigationLayout>
    );
};
