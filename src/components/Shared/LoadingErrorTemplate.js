// react
import React from "react";
import PropTypes from "prop-types";

// material ui
import { CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// local
import ErrorPage from "components/Shared/ErrorPage";
import NotFound from "navigation/NotFound";

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
  children,
  state,
  errorText,
  show404,
  loadingPage,
  amount,
  note
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
        loadingPage ?? <CustomProgress amount={amount} note={note} />
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
