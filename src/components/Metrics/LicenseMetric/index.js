// react
import { useContext } from "react";

// DependenciesMetric
import MultipleLicenseMetric from "./MultipleLicenseMetric";
import SingleLicenseMetric from "./SingleLicenseMetric";

// Shared
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// redux
import { StateContext } from "App";

const LicenseMetric = () => {
  const state = useContext(StateContext);

  return (
    <LoadingErrorTemplate
      state={state.error ? "error" : state.metrics.licenses.total}
      amount={state?.loading?.init?.amount}
      note={state?.loading?.init?.note}
    >
      {state.roots.length === 1 ? (
        <SingleLicenseMetric metric={state.metrics.licenses} />
      ) : (
        <MultipleLicenseMetric metric={state.metrics.licenses} />
      )}
    </LoadingErrorTemplate>
  );
};

LicenseMetric.propTypes = {};

export default LicenseMetric;
