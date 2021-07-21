// React
import React, { useContext } from "react";

// local components
import NetworkGraph from "components/Dashboard/Advise/NetworkGraph.js";

// utils
import { useFormatVisGraph } from "utils/produceMetrics";

// material-ui
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

// redux
import { StateContext } from "App";

//vis-dataset
import { DataSet } from "vis-network/standalone/esm/vis-network";

const useStyles = makeStyles(theme => ({
  graph: {
    padding: theme.spacing(4)
  }
}));

const PackageDependencies = () => {
  const classes = useStyles();
  const state = useContext(StateContext);
  const root = state.focus ?? "*App";

  const visGraph = useFormatVisGraph(root, state.graph);

  return (
    <LoadingErrorTemplate isLoading={visGraph === undefined}>
      <Paper></Paper>
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
    </LoadingErrorTemplate>
  );
};

export default PackageDependencies;
