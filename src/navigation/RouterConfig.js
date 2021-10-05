import { Route, Switch } from "react-router-dom";
import { ROOT, ADVISE, PACKAGE } from "./CONSTANTS";
import NotFound from "./NotFound";
import Home from "pages/Home/Home";
import Dashboard from "pages/Dashboard/Dashboard";
import PackageOverview from "pages/PackageOverview/PackageOverview";

export const RouterConfig = () => {
  return (
    <Switch>
      <Route exact path={ROOT} component={Home} />
      <Route exact path={ADVISE + "/:analysis_id"} component={Dashboard} />
      <Route
        exact
        path={PACKAGE + "/:package_name/:package_version?"}
        component={PackageOverview}
      />

      <Route path="*" status={404}>
        <NotFound />
      </Route>
    </Switch>
  );
};

export default RouterConfig;
