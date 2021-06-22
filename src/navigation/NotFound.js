import { Typography } from "@material-ui/core";

export const NotFound = ({ text }) => {
  return <Typography variant="h2">404: {text ?? "page"} not found!</Typography>;
};

export default NotFound;
