// react
import React from "react";
import PropTypes from "prop-types";

// material ui
import { CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

// local
import ErrorPage from "components/Shared/ErrorPage";

// component styling
const useStyles = makeStyles(theme => ({
  customProgressRoot: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

const CustomProgress = ({ amount, note }) => {
  const classes = useStyles();
  return (
    <div className={classes.customProgressRoot}>
      <CircularProgress
        variant={amount ? "determinate" : "indeterminate"}
        value={amount ?? 0}
      />
      {note ? (
        <Typography align="center" variant="body1">
          {note}
        </Typography>
      ) : null}
    </div>
  );
};

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
