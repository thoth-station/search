// React
import React, { useState, useEffect } from "react";

// local components
import NetworkGraph from "components/Metrics/DependenciesMetric/NetworkGraph.js";
import ErrorPage from "components/Shared/ErrorPage";

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

const PackageDependencies = ({ graphData, metadata }) => {
  const classes = useStyles();

  return (
    <LoadingErrorTemplate
      state={
        graphData === undefined
          ? "loading"
          : graphData === "error"
          ? "error"
          : undefined
      }
      errorPage={<ErrorPage text={"Could not load in dependency graph"} />}
    >
      <Paper>
        <NetworkGraph
          data={{
            nodes: new DataSet(graphData?.nodes),
            edges: new DataSet(graphData?.edges)
          }}
          className={classes.graph}
          root={metadata.info.name + metadata.info.version}
        />
      </Paper>
    </LoadingErrorTemplate>
  );
};

export default PackageDependencies;
