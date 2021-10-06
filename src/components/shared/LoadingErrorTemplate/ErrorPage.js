import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

const ErrorText = ({ text }) => {
  return (
    <Typography align="center" color="error" variant="body1">
      {text}
    </Typography>
  );
};

ErrorText.propTypes = {
  text: PropTypes.string.isRequired
};

export default ErrorText;
