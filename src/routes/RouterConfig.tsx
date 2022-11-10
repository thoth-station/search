import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "features/home";
import { NotFound } from "routes/NotFound";
import { AdviseRoutes } from "pages/advise/AdviseRoutes";
import { PackageRoutes } from "features/package";

export const RouterConfig = () => {
  return (
    <BrowserRouter basename={process.env.REACT_APP_DEPLOYMENT === "STAGE" ? "/search-stage" : "/search"}>
      <Routes>
        <Route path={"/"} element={<Home />} />
        <Route path={"advise/:analysis_id/*"} element={<AdviseRoutes />} />
        <Route path={"package/:package_name/*"} element={<PackageRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterConfig;
