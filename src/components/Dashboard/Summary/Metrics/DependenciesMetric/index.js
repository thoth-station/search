// react
import { useContext } from "react";

// DependenciesMetric
import MultipleDependenciesMetric from "./MultipleDependenciesMetric";
import SingleDependenciesMetric from "./SingleDependenciesMetric";

// Shared
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// redux
import { StateContext } from "App";

const DependenciesMetric = ({ metric }) => {
  const state = useContext(StateContext);
  console.log(metric);

  return (
    <LoadingErrorTemplate isLoading={!metric}>
      {state?.focus ? (
        <SingleDependenciesMetric metric={metric} />
      ) : (
        <MultipleDependenciesMetric metric={metric} />
      )}
    </LoadingErrorTemplate>
  );
};

export default DependenciesMetric;
