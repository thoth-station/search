import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "features/home";
import { NotFound } from "features/misc";
import { AdviseRoutes } from "features/advise";
import { PackageRoutes } from "features/package";

export const RouterConfig = () => {
    return (
        <BrowserRouter basename={"/search"}>
            <Routes>
                <Route exact path={"/"} element={<Home />} />
                <Route
                    exact
                    path={"advise/:analysis_id/*"}
                    element={<AdviseRoutes />}
                />
                <Route
                    path={"package/:package_name/*"}
                    element={<PackageRoutes />}
                />
                <Route path="*" status={404} element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default RouterConfig;
