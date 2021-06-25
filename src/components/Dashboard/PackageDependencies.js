// React
import React from "react";

// local components
import NetworkGraph from "components/Metrics/DependenciesMetric/NetworkGraph.js";

// material-ui
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

//vis-dataset
import { DataSet } from "vis-network/standalone/esm/vis-network";

const useStyles = makeStyles(theme => ({
  graph: {
    padding: theme.spacing(4)
  }
}));

const PackageDependencies = ({ state }) => {
  const classes = useStyles();

  return (
    <LoadingErrorTemplate
      state={state.error.graph ? "error" : state.graph}
      errorText="Could not load in dependency graph."
    >
      <Paper>
        <NetworkGraph
          data={{
            nodes: new DataSet(state.graph?.nodes),
            edges: new DataSet(state.graph?.edges)
          }}
          className={classes.graph}
          root={state.metadata.info.name + state.metadata.info.version}
        />
      </Paper>
    </LoadingErrorTemplate>
  );
};

export default PackageDependencies;
