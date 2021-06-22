// material-ui
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import GavelIcon from "@material-ui/icons/Gavel";
import BookmarkIcon from "@material-ui/icons/Bookmark";

// local
import IconText from "components/Shared/IconText";

// utils
import { timeSince } from "utils/timeSince";

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

const PackageHeader = ({ data }) => {
  const classes = useStyles();

  return (
    <div>
      <div className={classes.titleRow}>
        <Typography variant="h4">
          <b>{data.info.name}</b>
        </Typography>
        <Typography className={classes.marginLeft} variant="subtitle1">
          v{data.info?.version}
        </Typography>
      </div>
      <Typography gutterBottom variant="body1">
        {data.info?.summary}
      </Typography>
      <div className={classes.linksRow}>
        <IconText text={data.info?.license} icon={<GavelIcon />} />
        <IconText
          className={classes.marginLeft}
          text={
            "Latest version published " +
            timeSince(
              new Date(data.releases[data.info.version][0]?.upload_time)
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
