// react
import React from "react";
import PropTypes from "prop-types";

// local
import ErrorText from "./ErrorText";
import CustomProgress from "./CustomProgress";

/**
 * A template placed over components that have mot yet loaded.
 */
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
            return <ErrorText text={errorText ?? "A unknown error occurred"} />;
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
    /** if to display the error screen or not */
    isError: PropTypes.bool,
    /** if to display the loading screen or not */
    isLoading: PropTypes.bool,
    /** If error, the custom error message displayed */
    errorText: PropTypes.string,
    /** Optional custom loading page */
    loadingPage: PropTypes.element,
    /** If using default loading, this is the total progress 0 - 100 */
    loadingAmount: PropTypes.number,
    /** The optional loading string to show what point in the progress */
    loadingText: PropTypes.string,
};

export default LoadingErrorTemplate;
