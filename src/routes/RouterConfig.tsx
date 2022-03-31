import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "features/home";
import { NotFound } from "routes/NotFound";
import { AdviseRoutes } from "features/advise";
import { PackageRoutes } from "features/package";
import { ImageRoutes } from "features/image";

export const RouterConfig = () => {
    return (
        <BrowserRouter
            basename={
                process.env.REACT_APP_DEPLOYMENT === "STAGE"
                    ? "/search-stage"
                    : "/search"
            }
        >
            <Routes>
                <Route path={"/"} element={<Home />} />
                <Route
                    path={"advise/:analysis_id/*"}
                    element={<AdviseRoutes />}
                />
                <Route
                    path={"package/:package_name/*"}
                    element={<PackageRoutes />}
                />
                <Route
                    path={"image/:analysis_id/*"}
                    element={<ImageRoutes />}
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RouterConfig;
