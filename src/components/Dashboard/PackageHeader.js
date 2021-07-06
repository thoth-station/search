// React
import React, { useContext } from "react";

// material-ui
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GavelIcon from "@material-ui/icons/Gavel";
import BookmarkIcon from "@material-ui/icons/Bookmark";

// local
import IconText from "components/Shared/IconText";

// utils
import { timeSince } from "utils/timeSince";

// redux
import { StateContext } from "App";

// component styling
const useStyles = makeStyles(theme => ({
  titleRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(1)
  },
  marginLeft: {
    marginLeft: theme.spacing(2)
  },
  marginRight: {
    marginRight: theme.spacing(2)
  },
  linksRow: {
    display: "flex",
    marginBottom: theme.spacing(3)
  },
  warning: {
    display: "flex"
  }
}));

const PackageHeader = () => {
  const classes = useStyles();
  const { roots, packageWarning } = useContext(StateContext);

  return (
    <div>
      <div className={classes.titleRow}>
        <Typography variant="h4">
          <b>{roots[0]?.metadata?.info?.name}</b>
        </Typography>
        <Typography className={classes.marginLeft} variant="subtitle1">
          v{roots[0]?.metadata?.info?.version ?? "NaN"}
        </Typography>
      </div>

      <Typography gutterBottom variant="body1">
        {roots[0]?.metadata?.info?.summary ?? "NaN"}
      </Typography>
      <div className={classes.linksRow}>
        <IconText
          text={roots[0]?.metadata?.info?.license ?? "NaN"}
          icon={<GavelIcon />}
        />
        <IconText
          className={classes.marginLeft}
          text={
            "Latest version published " +
            timeSince(
              new Date(
                roots[0]?.metadata?.releases?.[
                  roots[0]?.metadata?.info?.version
                ]?.[0]?.upload_time
              )
            ) +
            " ago."
          }
          icon={<BookmarkIcon />}
        />
      </div>
      {packageWarning && packageWarning.length !== 0
        ? packageWarning.map(p => {
            return (
              <Typography
                gutterBottom
                color={"error"}
                className={classes.marginRight}
                variant="body2"
              >
                Dependency <i>{packageWarning[0].value.label}</i>{" "}
                <i>{packageWarning[0].value.metadata.info.version}</i> is
                currently not supported by Thoth.
              </Typography>
            );
          })
        : null}
    </div>
  );
};

export default PackageHeader;
