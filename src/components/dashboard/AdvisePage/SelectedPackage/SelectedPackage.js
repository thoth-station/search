// React
import React, { useContext } from "react";

// material-ui
import { Typography, Grid, Box, Paper } from "@material-ui/core";
import GavelIcon from "@material-ui/icons/Gavel";
import BookmarkIcon from "@material-ui/icons/Bookmark";

// local
import IconText from "components/shared/IconText";
import NetworkGraphView from "./NetworkGraphView";

// redux
import { StateContext } from "App";

const SelectedPackage = ({ selectedKey }) => {
  const state = useContext(StateContext);

  const selected = state.mergedGraph.nodes.get(selectedKey);

  return (
    <Box>
      <Paper sx={{ padding: 2 }}>
        <Grid container alignItems="center" mb={1}>
          <Grid item sx={6}>
            <Typography variant="h4">
              <b>{selected?.value?.metadata?.name}</b>
            </Typography>
          </Grid>
          <Grid item sx={6}>
            <Typography
              ml={2}
              variant="subtitle1"
              color={selected?.value?.latestVersion ? "initial" : "error"}
            >
              v{selected?.value?.metadata?.version ?? "NaN"}
            </Typography>
          </Grid>
        </Grid>

        <Typography gutterBottom variant="body1">
          {selected?.value?.metadata?.summary ?? "NaN"}
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <IconText
              text={selected?.value?.metadata?.license ?? "NaN"}
              icon={<GavelIcon />}
            />
          </Grid>
          <Grid item>
            <IconText
              ml={2}
              text={
                selected?.value?.latestVersion
                  ? "Latest version is installed"
                  : "Installed version is NOT the latest."
              }
              icon={<BookmarkIcon />}
            />
          </Grid>
        </Grid>
      </Paper>
      <Typography variant="h6" mt={2}>
        Thoth Justifications
      </Typography>
      <Paper sx={{ padding: 2 }}>Some text</Paper>
      <Typography variant="h6" mt={2}>
        Package Origins
      </Typography>
      <Paper>
        <NetworkGraphView root={"*App"} selected={selected} />
      </Paper>
    </Box>
  );
};

export default SelectedPackage;
