// React
import React, { useState, useEffect } from "react";

// local components
import NetworkGraph from "components/Metrics/DependenciesMetric/NetworkGraph.js";
import ErrorPage from "components/Shared/ErrorPage";

// utils
import { createDependencyGraph } from "utils/createDependencyGraph";

// material-ui
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import LoadingErrorTemplate from "components/Shared/LoadingErrorTemplate";

//vis-dataset
import { DataSet } from "vis-network/standalone/esm/vis-network";

const useStyles = makeStyles(theme => ({
  graph: {
    padding: theme.spacing(4)
  },
  progress: {
    marginLeft: "50%",
    marginTop: "25%"
  }
}));

const PackageDependencies = ({ data }) => {
  const classes = useStyles();
  const [graphData, setGraphData] = useState(undefined);

  useEffect(() => {
    createDependencyGraph(data.info.name, data.info.version)
      .then(r => {
        setGraphData({
          nodes: new DataSet(r.nodes),
          edges: new DataSet(r.edges)
        });
      })
      .catch(error => {
        setGraphData("error");
        console.log(error);
      });
  }, [data]);

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
          data={graphData}
          className={classes.graph}
          root={data.info.name + data.info.version}
        />
      </Paper>
    </LoadingErrorTemplate>
  );
};

export default PackageDependencies;
