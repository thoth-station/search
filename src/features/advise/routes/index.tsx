import React, { useEffect, useMemo } from "react";
import { Route, Routes, useParams, Navigate } from "react-router-dom";

// sub-routes
import { AdviseSummary } from "./AdviseSummary";
import { AdviseDetails } from "./AdviseDetails";
import { AdviseCompare } from "./AdviseCompare";

// feature specific imports
import { useAdviseDocument, useAdviseLogs } from "../api";
import { formatLockfile } from "utils/formatLockfile";
import { useMetrics } from "../hooks";
import { Requirements, useGraph } from "hooks";

// misc
import { AdviseNotFound } from "./AdviseNotFound";
import { AxiosResponse } from "axios";
import { components } from "lib/schema";
import { LOCAL_STORAGE_KEY } from "config";
import { AdviserLayout, MainLayout, NavigationLayout } from "components/Layout";
import Loading from "../../../components/Elements/Loading/Loading";
import { AdviseLogs } from "./AdviseLogs";
import { AdviseStackInfo } from "./AdviseStackInfo";

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

    const loading = useMemo(() => {
        if (adviseDocument.isLoading) {
            return <Loading type="circular" label="Fetching Advise Document" />;
        }

        if (!adviseDocument.data) {
            return (
                <NavigationLayout>
                    <AdviseNotFound analysis_id={analysis_id ?? "no id"} />
                </NavigationLayout>
            );
        }
    }, [adviseDocument.data, adviseDocument.status]);

    const lastLog = useMemo(() => {
        try {
            return JSON.parse(
                logs.data?.data?.log?.split("\n")?.at(-2) ?? "{}",
            );
        } catch (e) {
            return {};
        }
    }, [logs.data]);

    const stackInfoTotals = useMemo(() => {
        if (!adviseDocument.data?.data?.result?.report?.stack_info) {
            return {
                info: 0,
                warning: 0,
                error: 0,
            };
        }
        return {
            info:
                adviseDocument.data?.data.result.report?.stack_info.filter(
                    t => t.type === "INFO",
                ).length ?? 0,
            warning:
                adviseDocument.data?.data.result.report?.stack_info.filter(
                    t => t.type === "WARNING",
                ).length ?? 0,
            error:
                adviseDocument.data?.data.result.report?.stack_info.filter(
                    t => t.type === "ERROR",
                ).length ?? 0,
        };
    }, [adviseDocument.data?.data]);

    return (
        <AdviserLayout chipData={{ "stack-info": stackInfoTotals }}>
            <MainLayout>
                {loading ?? (
                    <Routes>
                        <Route
                            path="summary"
                            element={
                                <AdviseSummary
                                    adviseDocument={adviseDocument?.data?.data}
                                    metrics={metrics}
                                    lastLog={lastLog}
                                />
                            }
                        />
                        <Route
                            path="packages"
                            element={<AdviseDetails graph={graph} />}
                        />
                        <Route
                            path="logs"
                            element={<AdviseLogs logs={logs.data?.data?.log} />}
                        />
                        <Route
                            path="compare"
                            element={
                                <AdviseCompare
                                    adviseDocument={adviseDocument?.data?.data}
                                />
                            }
                        />
                        <Route
                            path="stack-info"
                            element={
                                <AdviseStackInfo
                                    stack_info={
                                        adviseDocument.data?.data?.result
                                            ?.report?.stack_info
                                    }
                                />
                            }
                        />
                        <Route path="*" element={<Navigate to="summary" />} />
                    </Routes>
                )}
            </MainLayout>
        </AdviserLayout>
    );
};
