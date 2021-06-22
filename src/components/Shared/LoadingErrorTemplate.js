// react
import React from "react";
import PropTypes from "prop-types";

// material ui
import CircularProgress from "@material-ui/core/CircularProgress";

// local
import NotFound from "navigation/NotFound";

const LoadingErrorTemplate = ({ children, state, errorPage, loadingPage }) => {
  return (
    <>
      {state === "error"
        ? errorPage ?? <NotFound />
        : state === "loading"
        ? loadingPage ?? <CircularProgress />
        : children}
    </>
  );
};

LoadingErrorTemplate.propTypes = {
  state: PropTypes.oneOf(["loading", "error", undefined])
};

export default LoadingErrorTemplate;
