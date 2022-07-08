import React from "react";
import { Button, Alert, AlertColor, AlertProps } from "@mui/material";

interface ICustomAlert extends AlertProps {
  /** The alert content. */
  info: {
    /** Link to navigate to if alert is actioned on. */
    link?: string;
    /** Text displayed in the alert. */
    message: string;
    /** Severity (color) of alert: `["ERROR", "WARNING", "INFO", "SUCCESS"]`. */
    type: AlertColor;
  };
}

/**
 * A custom alert card.
 */
const CustomAlert = ({ info, ...props }: ICustomAlert) => {
  return (
    <Alert
      action={
        info.link ? (
          <Button color="inherit" size="small" href={info?.link}>
            DETAILS
          </Button>
        ) : undefined
      }
      severity={info.type}
      {...props}
    >
      {info?.message}
    </Alert>
  );
};

export default CustomAlert;
