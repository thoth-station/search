// material-ui
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import GavelIcon from "@material-ui/icons/Gavel";
import BookmarkIcon from "@material-ui/icons/Bookmark";

// local
import IconText from "components/Elements/IconText";

// utils
import timeSince from "utils/timeSince";
import PropTypes from "prop-types";

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

/**
 * A header for package metadata.
 */
const PackageHeader = ({package_data}) => {
  const classes = useStyles();

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

PackageHeader.propTypes = {
    /** Package metadata object.*/
    package_data: PropTypes.shape({
        /** Name of package. */
        name: PropTypes.string.isRequired,
        /** Version of package. */
        version: PropTypes.string.isRequired,
        /** The latest version of the package. (used to calculate the time sense last update) */
        latest_version: PropTypes.string,
        /** Description of package. */
        summary: PropTypes.string,
        /** License of package */
        license: PropTypes.string,
        /** specific all versions object with each key being a version and having a param of date.
         *
         * ```
         * all_versions: {
         *     1.2.3: {
         *         date: "12-2-2020"
         *     }
         * }
         * ```
         */
        all_versions: PropTypes.object
    })
}

export default PackageHeader;
