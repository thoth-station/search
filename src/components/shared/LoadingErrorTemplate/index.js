// react
import React from "react";
import PropTypes from "prop-types";

// local
import ErrorPage from "./ErrorPage";
import CustomProgress from "./CustomProgress";

const LoadingErrorTemplate = ({
  isError,
  isLoading,
  errorText,
  loadingPage,
  loadingAmount,
  loadingText,
  children
}) => {
  const renderChoice = () => {
    if (isError) {
      return <ErrorPage text={errorText ?? "A unknown error occured"} />;
    } else if (isLoading) {
      return (
        loadingPage ?? (
          <CustomProgress amount={loadingAmount} note={loadingText} />
        )
      );
    } else {
      return children;
    }
  };

  return <>{renderChoice()}</>;
};

LoadingErrorTemplate.propTypes = {
  state: PropTypes.any
};

export default LoadingErrorTemplate;
