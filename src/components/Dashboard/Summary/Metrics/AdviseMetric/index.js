// react
import { useContext } from "react";

// Shared
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

import AdviseMetric from "./AdviseMetric";

// redux
import { StateContext } from "App";

const DependenciesMetric = () => {
  const state = useContext(StateContext);

  return (
    <LoadingErrorTemplate isLoading={!state.metrics?.advise}>
      {!state?.focus ? <AdviseMetric metric={state.metrics.advise} /> : null}
    </LoadingErrorTemplate>
  );
};

export default DependenciesMetric;
