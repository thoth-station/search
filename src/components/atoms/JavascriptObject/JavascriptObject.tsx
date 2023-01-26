// react
import React from "react";

// material-ui
import { Typography } from "@mui/material";

interface IJavascriptObject {
  /** The object */
  obj: any;
}

/**
 * Renders out an object with indentations
 */
const JavascriptObject = ({ obj = {} }: IJavascriptObject) => {
  return (
    <Typography variant="caption">
      <pre>
        <div
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(obj, undefined, 4),
          }}
        />
      </pre>
    </Typography>
  );
};

export default JavascriptObject;
