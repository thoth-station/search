// react
import React from "react";

import { Typography, Grid } from "@material-ui/core";
import GavelIcon from "@material-ui/icons/Gavel";
import BookmarkIcon from "@material-ui/icons/Bookmark";

// local
import IconText from "components/shared/IconText";

const Popup = ({ node }) => {
  return (
    <div>
      <Grid container alignItems="center">
        <Grid item sx={6}>
          <Typography variant="h6">
            <b>{node.value.id}</b>
          </Typography>
        </Grid>
        <Grid item sx={6}>
          <Typography ml={2} variant="body1">
            v{node.value.version ?? "NaN"}
          </Typography>
        </Grid>
      </Grid>
      <Typography gutterBottom variant="body2">
        {node.value?.metadata?.summary ?? "NaN"}
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <IconText
            text={node.value?.metadata?.license ?? "NaN"}
            icon={<GavelIcon />}
          />
        </Grid>
        <Grid item>
          <IconText
            ml={2}
            text={
              node.value?.latestVersion
                ? "Latest version is installed"
                : "Installed version is NOT the latest."
            }
            icon={<BookmarkIcon />}
          />
        </Grid>
      </Grid>
      <Typography variant="body2" mt={2}>
        {node.value?.justifications?.header}
      </Typography>
    </div>
  );
};

export default Popup;
