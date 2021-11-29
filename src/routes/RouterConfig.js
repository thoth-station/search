import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "features/home";
import {NotFound} from "features/misc";
import {AdviseRoutes} from "features/advise";

export const RouterConfig = () => {
  return (
      <BrowserRouter basename={"/thoth-search"}>
          <Routes>
            <Route exact path={"/"} element={<Home />} />
            <Route path={"advise/:analysis_id/*"} element={<AdviseRoutes />} />

            {/*<Route*/}
            {/*exact*/}
            {/*path={"package/:package_name/:package_version?"}*/}
            {/*component={PackageOverview}*/}
            {/*/>*/}
            <Route path="*" status={404} element={<NotFound/>} />
          </Routes>
      </BrowserRouter>
  );
};

export default RouterConfig;
