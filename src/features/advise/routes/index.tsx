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
import { useGraph } from "hooks";

// misc
import { AdviseNotFound } from "./AdviseNotFound";
import { AxiosResponse } from "axios";
import { components } from "lib/schema";
import { LOCAL_STORAGE_KEY } from "config";
import { AdviserLayout, MainLayout, NavigationLayout } from "components/Layout";
import Loading from "../../../components/Elements/Loading/Loading";
import { AdviseLogs } from "./AdviseLogs";
import { AdviseStackInfo } from "./AdviseStackInfo";
import { AdviseEnvironmentInfo } from "./AdviseEnvironmentInfo";
import { AdviseLicenses } from "./AdviseLicenses";

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
    if (adviseDocument.isSuccess && adviseDocument.data.data?.result?.report?.products?.[0]?.project) {
      const lockfile = adviseDocument.data.data?.result?.report?.products?.[0]
        ?.project as components["schemas"]["ProjectDef"];
      return formatLockfile(lockfile);
    }
  }, [adviseDocument]);

  // (
  //   (adviseDocument?.data?.data?.result?.report?.products?.[0]?.project as components["schemas"]["ProjectDef"])
  //     ?.requirements as Requirements
  // )?.packages,

  const graph = useGraph(
    graphData,
    undefined,
    adviseDocument?.data?.data?.result?.report?.products?.[0]?.justification,
    adviseDocument?.data?.data,
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
      return JSON.parse(logs.data?.data?.log?.split("\n")?.at(-2) ?? "{}");
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
      info: adviseDocument.data?.data.result.report?.stack_info.filter(t => t.type === "INFO").length ?? 0,
      warning: adviseDocument.data?.data.result.report?.stack_info.filter(t => t.type === "WARNING").length ?? 0,
      error: adviseDocument.data?.data.result.report?.stack_info.filter(t => t.type === "ERROR").length ?? 0,
    };
  }, [adviseDocument.data?.data]);

  const licenseTotals = useMemo(() => {
    const data = {
      info: 0,
      warning: 0,
      error: 0,
    };

    if (!metrics.licenses) {
      return data;
    }

    Object.values(metrics.licenses).forEach(license => {
      switch (license.metadata.isOsiApproved) {
        case null:
          data.warning += Object.keys(license.packages).length;
          break;
        case false:
          data.error += Object.keys(license.packages).length;
          break;
      }
    });

    return data;
  }, [metrics.licenses]);

  return (
    <AdviserLayout
      chipData={{
        "stack-info": stackInfoTotals,
        licenses: licenseTotals,
      }}
    >
      <MainLayout>
        {loading ?? (
          <Routes>
            <Route
              path="summary"
              element={<AdviseSummary adviseDocument={adviseDocument?.data?.data} graph={graph} lastLog={lastLog} />}
            />
            <Route path="packages" element={<AdviseDetails graph={graph} />} />
            <Route path="packages/:pkg" element={<AdviseDetails graph={graph} />} />
            <Route path="logs" element={<AdviseLogs logs={logs.data?.data?.log} />} />
            <Route path="compare" element={<AdviseCompare adviseDocument={adviseDocument?.data?.data} />} />
            <Route
              path="stack-info"
              element={<AdviseStackInfo stack_info={adviseDocument.data?.data?.result?.report?.stack_info} />}
            />
            <Route
              path="environment"
              element={
                <AdviseEnvironmentInfo
                  runtime_environment={
                    adviseDocument.data?.data?.result?.report?.products?.[0]?.project?.runtime_environment
                  }
                  pipfileLock={JSON.stringify(
                    (
                      adviseDocument.data?.data?.result?.parameters as {
                        project: components["schemas"]["ProjectDef"];
                      }
                    )?.project.requirements_locked ?? {},
                  )}
                  pipfile={JSON.stringify(
                    (
                      adviseDocument.data?.data?.result?.parameters as {
                        project: components["schemas"]["ProjectDef"];
                      }
                    )?.project.requirements ?? {},
                  )}
                />
              }
            />
            <Route path="licenses" element={<AdviseLicenses metric={metrics.licenses} />} />
            <Route path="*" element={<Navigate to="summary" />} />
          </Routes>
        )}
      </MainLayout>
    </AdviserLayout>
  );
};
