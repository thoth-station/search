// React
import React, { useContext } from "react";

// material-ui
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import GavelIcon from "@material-ui/icons/Gavel";
import BookmarkIcon from "@material-ui/icons/Bookmark";

// local
import IconText from "components/shared/IconText";

// utils
import timeSince from "utils/timeSince";
// redux
import { StateContext } from "App";

// component styling
const useStyles = makeStyles(theme => ({
  titleRow: {
    display: "flex",
    alignItems: "center"
  },
  marginLeft: {
    marginLeft: theme.spacing(2)
  },
  linksRow: {
    display: "flex"
  }
}));

const PackageHeader = () => {
  const classes = useStyles();
  const { package_data } = useContext(StateContext);

  return (
    <div>
      <div className={classes.titleRow} mb={1}>
        <Typography variant="h4">
          <b>{package_data?.name}</b>
        </Typography>
        <Typography ml={2} variant="h6">
          v{package_data?.version ?? "NaN"}
        </Typography>
      </div>

      <Typography gutterBottom variant="body1">
        {package_data?.summary ?? "NaN"}
      </Typography>
      <div className={classes.linksRow} mb={3}>
        <IconText text={package_data?.license ?? "NaN"} icon={<GavelIcon />} />
        <IconText
          className={classes.marginLeft}
          text={
            "Latest version published " +
            timeSince(
              new Date(
                package_data?.all_versions?.[package_data?.latest_version]?.date
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
