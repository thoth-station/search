// react
import { useContext } from "react";

// DependenciesMetric
import MultipleLicenseMetric from "./MultipleLicenseMetric";
import SingleLicenseMetric from "./SingleLicenseMetric";

// Shared
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// redux
import { StateContext } from "App";

const LicenseMetric = ({ metric }) => {
  const state = useContext(StateContext);

  return (
    <LoadingErrorTemplate isLoading={!metric}>
      {state?.focus ? (
        <SingleLicenseMetric metric={metric} />
      ) : (
        <MultipleLicenseMetric metric={metric} />
      )}
    </LoadingErrorTemplate>
  );
};

LicenseMetric.propTypes = {};

export default LicenseMetric;
