import { Typography } from "@material-ui/core";
import PropTypes from "prop-types";

const ErrorPage = ({ text }) => {
  return <Typography variant="h2">{text}</Typography>;
};

ErrorPage.propTypes = {
  text: PropTypes.string.isRequired
};

export default ErrorPage;
