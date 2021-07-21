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
    <LoadingErrorTemplate isLoading={state.metrics?.licences}>
      {state?.focus ? (
        <SingleLicenseMetric metric={state.metrics.licenses} />
      ) : (
        <MultipleLicenseMetric metric={state.metrics.licenses} />
      )}
    </LoadingErrorTemplate>
  );
};

LicenseMetric.propTypes = {};

export default LicenseMetric;