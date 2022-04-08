import React, { useEffect, useMemo } from "react";
import { Route, Routes, useParams, Navigate } from "react-router-dom";

// layouts
import { AdviseLayout } from "components/Layout";

// sub-routes
import { AdviseSummary } from "./AdviseSummary";
import { AdviseDetails } from "./AdviseDetails";
import { AdviseCompare } from "./AdviseCompare";

// feature specific imports
import { useAdviseDocument, useAdviseLogs } from "../api";
import { formatLockfile } from "utils/formatLockfile";
import { AdviseHeader } from "../components";
import { useMetrics } from "../hooks";
import { Requirements, useGraph } from "hooks";

// misc
import { CircularProgress } from "@mui/material";
import { AdviseNotFound } from "./AdviseNotFound";
import { NavigationLayout } from "components/Layout/NavigationLayout";
import { AxiosResponse } from "axios";
import { components } from "lib/schema";
import { LOCAL_STORAGE_KEY } from "config";

type statusResponse = components["schemas"]["AnalysisStatusResponse"];

export const AdviseRoutes = () => {
    // get document id
    const { analysis_id } = useParams();

    // api get thoth advise document
    const adviseDocument = useAdviseDocument(analysis_id, {
        useErrorBoundary: false,
        refetchInterval: (data: AxiosResponse<statusResponse>) => {
            if (data?.data?.status) {
                return 10000;
            }
            return false;
        },
    });

    useEffect(() => {
        if (adviseDocument.isSuccess && analysis_id) {
            const ids = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "";

            const split = ids.split(",");
            if (!split.includes(analysis_id)) {
                split.push(analysis_id);
                localStorage.setItem(LOCAL_STORAGE_KEY, split.join(","));
            }
        }
    }, [adviseDocument.status]);

    const logs = useAdviseLogs(analysis_id, {
        useErrorBoundary: false,
        refetchInterval: () => {
            if (adviseDocument.data?.data?.status) {
                return 10000;
            }
            return false;
        },
    });

    // format advise graph data
    const graphData = useMemo(() => {
        if (
            adviseDocument.isSuccess &&
            adviseDocument.data.data?.result?.report?.products?.[0]?.project
        ) {
            const lockfile = adviseDocument.data.data?.result?.report
                ?.products?.[0]?.project as components["schemas"]["ProjectDef"];
            return formatLockfile(lockfile);
        }
    }, [adviseDocument]);

    const graph = useGraph(
        graphData,
        (
            (
                adviseDocument?.data?.data?.result?.report?.products?.[0]
                    ?.project as components["schemas"]["ProjectDef"]
            )?.requirements as Requirements
        )?.packages,
        adviseDocument?.data?.data?.result?.report?.products?.[0]
            ?.justification,
    );

    // compute metric data
    const metrics = useMetrics(graph, adviseDocument.data?.data);

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
                <AdviseNotFound analysis_id={analysis_id ?? "no id"} />
            </NavigationLayout>
        );
    }

    return (
        <NavigationLayout goHome={true}>
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
                        element={<AdviseDetails graph={graph} />}
                    />
                    <Route
                        path="compare"
                        element={
                            <AdviseCompare
                                adviseDocument={adviseDocument.data.data}
                            />
                        }
                    />
                    <Route path="*" element={<Navigate to="summary" />} />
                </Routes>
            </AdviseLayout>
        </NavigationLayout>
    );
};
