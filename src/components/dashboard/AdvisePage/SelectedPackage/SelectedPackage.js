// React
import React, { useContext } from "react";

// material-ui
import { Typography, Grid, Box, Paper, Link, Button } from "@material-ui/core";
import GavelIcon from "@material-ui/icons/Gavel";
import BookmarkIcon from "@material-ui/icons/Bookmark";

// local
import IconText from "components/shared/IconText";
import NetworkGraphView from "./NetworkGraphView";

// redux
import { StateContext } from "App";

const SelectedPackage = ({ selectedKey, setSelected }) => {
  const state = useContext(StateContext);

  const selected = state.mergedGraph.nodes.get(selectedKey);

  const dependents = { removed: [], added: [], version: [], unchanged: [] };
  [...selected?.parents]
    .filter(p => p !== "*App")
    .forEach(node => {
      dependents[state.mergedGraph.nodes.get(node).value.change].push(node);
    });

  return (
    <Box>
      <Paper sx={{ padding: 2 }}>
        <Grid container alignItems="center" mb={1}>
          <Grid item sx={6}>
            <Typography variant="h3">
              <b>{selected?.value?.metadata?.name}</b>
            </Typography>
          </Grid>
          <Grid item sx={6}>
            <Typography ml={2} variant="h6">
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

      <Paper sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h5">Thoth Justifications</Typography>
        <Typography variant="body1" mt={2}>
          {selected?.value?.justifications?.header}
        </Typography>
        {selected?.value?.justifications?.reasons?.length ? (
          <ul>
            {selected?.value?.justifications?.reasons.map(reason => {
              return (
                <li key={reason.package}>
                  <Typography variant="body1" mt={2}>
                    <Link
                      underline="hover"
                      onClick={() => setSelected(reason.package)}
                    >
                      {reason.package}
                    </Link>
                    {reason.reason}
                  </Typography>
                </li>
              );
            })}
          </ul>
        ) : null}

        {selected?.value?.justifications?.thoth?.length > 0 ? (
          <Typography variant="h6" mt={2}>
            Security Reasonings
          </Typography>
        ) : null}
        {selected?.value?.justifications?.thoth?.map(reason => {
          return (
            <Grid container alignItems="center" ml={3}>
              <Grid item xs={10}>
                <Typography variant="body1" mt={1}>
                  {reason.message}
                </Typography>
                <Typography variant="body2" ml={3} mt={0.5}>
                  {reason.advisory}
                </Typography>
              </Grid>
              <Grid item>
                <Button href={reason.link}>READ MORE</Button>
              </Grid>
            </Grid>
          );
        })}
      </Paper>

      <Paper sx={{ padding: 2, marginTop: 2 }}>
        <Typography variant="h5" mb={2}>
          Package Origins
        </Typography>
        <Typography variant="body1" mb={2}>
          {[...selected?.parents].filter(p => p !== "*App")?.length === 0
            ? selected?.value?.label +
              " is not a dependent of any package in this Python environment"
            : "There are " +
              [...selected?.parents].filter(p => p !== "*App")?.length +
              " package(s) that have " +
              selected?.value?.label +
              " as a direct dependency. Of those package(s)"}

          {Object.keys(dependents).map((change, i, a) => {
            if (dependents[change].length === 0) {
              return null;
            }

            return (
              <React.Fragment>
                {", " +
                  dependents[change].length +
                  (change === "version"
                    ? " had a version change "
                    : (dependents[change].length === 1 ? " was " : " were ") +
                      change) +
                  " ("}
                {dependents[change].map((p, i, a) => {
                  let text = p;
                  if (i !== a.length - 1) {
                    text += ", ";
                  }
                  return (
                    <Link underline="hover" onClick={() => setSelected(p)}>
                      {text}
                    </Link>
                  );
                })}
                {")"}
              </React.Fragment>
            );
          })}
          {"."}
        </Typography>

        <NetworkGraphView root={"*App"} selected={selected} />
      </Paper>
    </Box>
  );
};

export default SelectedPackage;
