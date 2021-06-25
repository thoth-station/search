// react
import React from "react";
import PropTypes from "prop-types";

// material ui
import CircularProgress from "@material-ui/core/CircularProgress";

// local
import ErrorPage from "components/Shared/ErrorPage";
import NotFound from "navigation/NotFound";

const LoadingErrorTemplate = ({
  children,
  state,
  errorText,
  show404,
  loadingPage
}) => {
  return (
    <>
      {state === "error" ? (
        show404 ? (
          <NotFound text={show404} />
        ) : (
          <ErrorPage text={errorText ?? "A unknown error occured"} />
        )
      ) : state === undefined ? ( // loading if undefined
        loadingPage ?? <CircularProgress style={{ marginLeft: "50%" }} />
      ) : (
        children
      )}
    </>
  );
};

LoadingErrorTemplate.propTypes = {
  state: PropTypes.any
};

export default LoadingErrorTemplate;
