import { Route, Switch } from "react-router-dom";
import { ROOT, DASHBOARD } from "./CONSTANTS";
import NotFound from "./NotFound";
import Home from "pages/Home/Home";
import Dashboard from "pages/Dashboard/Dashboard";

export const RouterConfig = () => {
  return (
    <Switch>
      <Route exact path={ROOT} component={Home} />
      <Route exact path={DASHBOARD + "/:analysis_id"} component={Dashboard} />

      <Route path="*" status={404}>
        <NotFound />
      </Route>
    </Switch>
  );
};

export default RouterConfig;
