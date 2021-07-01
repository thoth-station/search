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
  linksRow: {
    display: "flex",
    marginBottom: theme.spacing(3)
  }
}));

const PackageHeader = () => {
  const classes = useStyles();
  const { roots } = useContext(StateContext);

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
      {roots[0].error ? (
        <Typography color="error" gutterBottom variant="body2">
          {roots[0].error}
        </Typography>
      ) : null}

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
    </div>
  );
};

export default PackageHeader;
