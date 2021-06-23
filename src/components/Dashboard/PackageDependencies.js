// React
import React, { useState, useEffect } from "react";

// local components
import NetworkGraph from "components/Metrics/DependenciesMetric/NetworkGraph.js";

// utils
import { createDependencyGraph } from "utils/createDependencyGraph";

// material-ui
import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  graph: {
    padding: theme.spacing(4)
  }
}));

const PackageDependencies = ({ data }) => {
  const classes = useStyles();
  const [graphData, setGraphData] = useState(undefined);

  useEffect(() => {
    createDependencyGraph(data.info.name, data.info.version).then(r => {
      setGraphData(r);
    });
  }, [data]);

  return (
    <Paper>
      {graphData !== undefined ? (
        <NetworkGraph
          data={graphData}
          className={classes.graph}
          root={data.info.name + data.info.version}
        />
      ) : null}
    </Paper>
  );
};

export default PackageDependencies;
