// React
import React, { useContext } from "react";

// material-ui
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import GavelIcon from "@material-ui/icons/Gavel";
import BookmarkIcon from "@material-ui/icons/Bookmark";

// local
import IconText from "components/Shared/IconText";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

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
  const { state } = useContext(StateContext);

  const metadata = state?.mergedGraph?.nodes?.get(state?.focus);

  return (
    <LoadingErrorTemplate isLoading={metadata === undefined}>
      <div className={classes.titleRow}>
        <Typography variant="h4">
          <b>{metadata?.name}</b>
        </Typography>
        <Typography className={classes.marginLeft} variant="subtitle1">
          v{metadata?.version ?? "NaN"}
        </Typography>
      </div>

      <Typography gutterBottom variant="body1">
        {metadata?.summary ?? "NaN"}
      </Typography>
      <div className={classes.linksRow}>
        <IconText text={metadata?.license ?? "NaN"} icon={<GavelIcon />} />
        <IconText
          className={classes.marginLeft}
          text={
            "Latest version published " +
            timeSince(
              new Date(
                metadata?.releases?.[metadata?.version]?.[0]?.upload_time
              )
            ) +
            " ago."
          }
          icon={<BookmarkIcon />}
        />
      </div>
    </LoadingErrorTemplate>
  );
};

export default PackageHeader;
