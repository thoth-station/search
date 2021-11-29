import { Button, Alert } from "@material-ui/core";
import PropTypes from "prop-types";

/**
 * A custom alert card.
 */
const CustomAlert = ({ info, ...props }) => {
  return (
    <Alert
      className={props?.className}
      action={
        <Button color="inherit" size="small" href={info?.link}>
          DETAILS
        </Button>
      }
      severity={info.type.toLowerCase()}
    >
      {info?.message}
    </Alert>
  );
};

CustomAlert.propTypes = {
    /** The alert content. */
    info: PropTypes.shape({
        /** Link to navigate to if alert is actioned on. */
        link: PropTypes.string.isRequired,
        /** Text displayed in the alert. */
        message: PropTypes.string.isRequired,
        /** Severity (color) of alert: `["ERROR", "WARNING", "INFO", "SUCCESS"]`. */
        type: PropTypes.oneOf(["ERROR", "WARNING", "INFO", "SUCCESS"]).isRequired
    }).isRequired,
    /** The `material-ui` styling classname */
    classname: PropTypes.string
}

export default CustomAlert;
