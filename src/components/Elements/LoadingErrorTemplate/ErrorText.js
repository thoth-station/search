import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

/**
 * Text that has been formatted as an error.
 */
const ErrorText = ({ text }) => {
  return (
    <Typography align="center" color="error" variant="body1">
      {text}
    </Typography>
  );
};

ErrorText.propTypes = {
  /** text for error */
  text: PropTypes.string.isRequired
};

export default ErrorText;
