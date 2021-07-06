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

  console.log(state);

  return (
    <LoadingErrorTemplate
      state={state.error ? "error" : state.metrics.dependencies.all.roots}
      amount={state?.loading?.init?.amount}
      note={state?.loading?.init?.note}
    >
      {state.roots.length === 1 ? (
        <SingleDependenciesMetric metric={state.metrics.dependencies} />
      ) : (
        <MultipleDependenciesMetric metric={state.metrics.dependencies} />
      )}
    </LoadingErrorTemplate>
  );
};

export default DependenciesMetric;
