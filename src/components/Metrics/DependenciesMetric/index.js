// react
import { useContext } from "react";

// DependenciesMetric
import MultipleDependenciesMetric from "./MultipleDependenciesMetric";
import SingleDependenciesMetric from "./SingleDependenciesMetric";

// Shared
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// redux
import { StateContext } from "App";

const DependenciesMetric = () => {
  const state = useContext(StateContext);

  return (
    <LoadingErrorTemplate
      state={state.error ? "error" : state.metrics.dependencies.all.roots}
    >
      {state.metrics.dependencies.all.roots === 1 ? (
        <SingleDependenciesMetric metric={state.metrics.dependencies} />
      ) : (
        <MultipleDependenciesMetric metric={state.metrics.dependencies} />
      )}
    </LoadingErrorTemplate>
  );
};

export default DependenciesMetric;
