import { Route, Switch } from "react-router-dom";
import { ROOT, DASHBOARD } from "./CONSTANTS";
import NotFound from "./NotFound";
import Home from "pages/Home/Home";
import Dashboard from "pages/Dashboard/Dashboard";

export const RouterConfig = () => {
  return (
    <Switch>
      <Route exact path={ROOT} component={Home} />
      <Route exact path={DASHBOARD} component={Dashboard} />
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
};

export default RouterConfig;
