import React, { useEffect } from "react";
import { Route, Routes, useParams, Navigate } from "react-router-dom";

// layouts
import { AdviserLayout, MainLayout, NavigationLayout } from "components/templates";

// sub-routes
import { AdviseSummary } from "./AdviseSummary";
import { AdviseDetails } from "./AdviseDetails";
import { AdviseCompare } from "./AdviseCompare";
import { AdviseLogs } from "./AdviseLogs";
import { AdviseStackInfo } from "./AdviseStackInfo";
import { AdviseEnvironmentInfo } from "./AdviseEnvironmentInfo";
import { AdviseLicenses } from "./AdviseLicenses";
import { AdviseDependencies } from "./AdviseDependencies";
import { AdviseNotFound } from "./AdviseNotFound";

// hooks
import { useAdviseDocument } from "api";

// utils
import { LOCAL_STORAGE_KEY } from "config";


export const AdviseRoutes = () => {
  // get document id
  const { analysis_id } = useParams();

  // api get thoth advise document
  const { query: adviseDocumentQuery } = useAdviseDocument(analysis_id);

  // add analysis id to history
  useEffect(() => {
    if (adviseDocumentQuery.isSuccess && analysis_id) {
      const ids = localStorage.getItem(LOCAL_STORAGE_KEY) ?? "";

      const split = ids.split(",");
      if (!split.includes(analysis_id)) {
        split.push(analysis_id);
        localStorage.setItem(LOCAL_STORAGE_KEY, split.join(","));
      }
    }
  }, [adviseDocumentQuery.status]);

  if (adviseDocumentQuery.isError || !analysis_id) {
    return (
      <NavigationLayout>
        <AdviseNotFound analysis_id={analysis_id ?? "no id"} />
      </NavigationLayout>
    );
  }

  return (
    <AdviserLayout analysis_id={analysis_id}>
      <MainLayout>
        <Routes>
          <Route path="summary" element={<AdviseSummary analysis_id={analysis_id} />} />
          <Route path="packages" element={<AdviseDetails analysis_id={analysis_id} />} />
          <Route path="packages/:pkg" element={<AdviseDetails analysis_id={analysis_id} />} />
          <Route path="logs" element={<AdviseLogs analysis_id={analysis_id} />} />
          <Route path="compare" element={<AdviseCompare analysis_id={analysis_id} />} />
          <Route path="compare/:cmp" element={<AdviseCompare analysis_id={analysis_id} />} />
          <Route path="stack-info" element={<AdviseStackInfo analysis_id={analysis_id} />} />
          <Route path="environment" element={<AdviseEnvironmentInfo analysis_id={analysis_id} />} />
          <Route path="licenses" element={<AdviseLicenses analysis_id={analysis_id} />} />
          <Route path="dependency-tree" element={<AdviseDependencies analysis_id={analysis_id} />} />
          <Route path="*" element={<Navigate to="summary" />} />
        </Routes>
      </MainLayout>
    </AdviserLayout>
  );
};
