// react
import React from "react";
import PropTypes from "prop-types";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  lockfile: {
    overflow: "scroll",
    paddingLeft: theme.spacing(1)
  }
}));

const LockfileView = ({ file }) => {
  const classes = useStyles();

  return (
    <Typography variant="caption">
      <pre>
        <div
          className={classes.lockfile}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(file, undefined, 4)?.replaceAll(
              new RegExp(
                '("' + Object.keys(file?.default)?.join('"|"') + '")',
                "g"
              ),
              match => {
                return `<a id="${match.slice(1, -1)}">${match}</a>`;
              }
            )
          }}
        />
      </pre>
    </Typography>
  );
};

LockfileView.propTypes = {
  file: PropTypes.shape({ default: PropTypes.object.isRequired })
};

export default LockfileView;
