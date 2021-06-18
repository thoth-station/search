import { Route, Switch } from "react-router-dom";
import { ROOT, DASHBOARD, SEARCH } from "./CONSTANTS";
import NotFound from "./NotFound";
import Home from "pages/Home/Home";
import Dashboard from "pages/Dashboard/Dashboard";
import SearchResults from "pages/SearchResults/SearchResults";

export const RouterConfig = () => {
  return (
    <Switch>
      <Route exact path={ROOT} component={Home} />
      <Route exact path={DASHBOARD} component={Dashboard} />
      <Route exact path={SEARCH} component={SearchResults} />
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};

export default RouterConfig;
