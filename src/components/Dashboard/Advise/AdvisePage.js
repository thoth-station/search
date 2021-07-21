// React
import React, { useContext } from "react";

// local components
import NetworkGraph from "components/Dashboard/Advise/NetworkGraph.js";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// utils
import { useFormatVisGraph } from "utils/produceMetrics";

// material-ui
import {
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Grid,
  Box
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/styles";

// redux
import { StateContext } from "App";

//vis-dataset
import { DataSet } from "vis-network/standalone/esm/vis-network";

const useStyles = makeStyles(theme => ({
  graph: {
    padding: theme.spacing(4),
    marginTop: theme.spacing(4)
  }
}));

const PackageDependencies = () => {
  const classes = useStyles();
  const state = useContext(StateContext);
  const root = state.focus ?? "*App";

  const visGraph = useFormatVisGraph(root, state.graph);
  console.log(state);

  return (
    <LoadingErrorTemplate isLoading={visGraph === undefined}>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="flex-start"
      >
        <Grid xs={6} md={6}>
          <Paper>
            <NetworkGraph
              data={{
                nodes: new DataSet(visGraph?.nodes),
                edges: new DataSet(visGraph?.edges)
              }}
              className={classes.graph}
              root={root}
            />
          </Paper>
        </Grid>
        <Grid item xs={6} md={6}>
          <Box mt={4}>
            {state?.advise?.report?.products?.[0]?.justification.map(
              (justification, i) => {
                if (justification.type !== "INFO") {
                  return (
                    <Accordion key={i}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>{justification.message}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{justification.advisory}</Typography>
                        <Button href={justification.link}>READ MORE</Button>
                      </AccordionDetails>
                    </Accordion>
                  );
                } else return null;
              }
            )}
          </Box>
        </Grid>
      </Grid>
    </LoadingErrorTemplate>
  );
};

export default PackageDependencies;
