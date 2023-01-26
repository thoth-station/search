// React
import React from "react";
import { Route, Routes } from "react-router-dom";

import { PackageOverview } from "./PackageOverview";
import { NotFound } from "routes/NotFound";
import { NavigationLayout } from "components/templates";

// The page that displays all analysis data
export const PackageRoutes = () => {
  return (
    <NavigationLayout>
      <Routes>
        <Route path="/:package_version/:index_url/:os_name/:os_version/:python_version" element={<PackageOverview />} />
        <Route path="/:package_version/:index_url/:os_name" element={<PackageOverview />} />
        <Route path="/:package_version/:index_url/:os_name/:os_version" element={<PackageOverview />} />
        <Route path="/:package_version/:index_url" element={<PackageOverview />} />
        <Route path="/:package_version" element={<PackageOverview />} />
        <Route path="/" element={<PackageOverview />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </NavigationLayout>
  );
};
