// react
import React, { useEffect, useRef, useContext } from "react";

// utils and configs
import { options } from "config/networkOptions";
import { StateContext } from "App";

// vis-network
import { Network, DataSet } from "vis-network/standalone/esm/vis-network";

// material ui
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column nowrap"
  },
  canvas: {
    flex: "1 1 auto",
    height: "50vh"
  }
}));

const NetworkGraph = ({ root, selected, ...props }) => {
  const classes = useStyles();
  const visJsRef = useRef(null);
  const state = useContext(StateContext);

  // create the graph
  useEffect(() => {
    if (!selected || !root || !state.mergedGraph) {
      return;
    }

    let nodes = state.mergedGraph.findAllNodesOnAllPaths(selected, "*App");

    nodes.set("*App", state.mergedGraph.nodes.get("*App"));

    // convert to vis graph format
    const convertedNodes = [];
    nodes.forEach(value => {
      convertedNodes.push(value.value);
    });
    const visData = {
      nodes: new DataSet(convertedNodes),
      edges: new DataSet(state.mergedGraph.visEdges)
    };

    const network =
      visJsRef.current && new Network(visJsRef.current, visData, options);

    // clear selection
    visData.nodes.updateOnly(
      visData.nodes.get().map(e => {
        if (e.id !== root) {
          e["color"] =
            state.mergedGraph.nodes.get(e.id)?.value?.color ??
            options.nodes.color;
        }
        return e;
      })
    );

    // set root node to have specific color
    const rootNode = visData.nodes.get(root);
    rootNode.color = "#4fc1ea";
    rootNode.font = { color: "#4fc1ea", strokeWidth: 3, size: 20 };
    visData.nodes.updateOnly(rootNode);

    // set selected node to have specific color
    const selectedNode = visData.nodes.get(selected.key);
    selectedNode.color = "#f39200";
    visData.nodes.updateOnly(selectedNode);

    // change curser when hovering and grabbing
    // Get the canvas HTML element
    var networkCanvas = document
      .getElementById("mynetwork")
      .getElementsByTagName("canvas")[0];

    // changes the curser graphic depedning on where and what the mouse is doing
    function changeCursor(newCursorStyle) {
      networkCanvas.style.cursor = newCursorStyle;
    }
    network.on("hoverNode", function() {
      changeCursor("grab");
    });
    network.on("blurNode", function() {
      changeCursor("default");
    });
    network.on("dragStart", function() {
      changeCursor("grabbing");
    });
    network.on("dragging", function() {
      changeCursor("grabbing");
    });
    network.on("dragEnd", function() {
      changeCursor("grab");
    });

    // fix (stick in place) node when done dragging
    network.on("dragEnd", function(params) {
      if (params.nodes.length !== 0 && !network.isCluster(params.nodes[0])) {
        network.editNode(params.nodes[0]);
      }
    });

    // un stick node if already stuck
    network.on("dragStart", function(params) {
      // check if node has not been touched or is fixed
      // if fixed then un fix
      if (
        params.nodes.length !== 0 &&
        network.body.nodes[params.nodes[0]].options.x !== undefined &&
        network.body.nodes[params.nodes[0]].options.x &&
        !network.isCluster(params.nodes[0])
      ) {
        // un fix node
        network.editNode(params.nodes[0]);
      }
    });
  }, [root, selected, state.mergedGraph]);

  return (
    <div className={`${classes.root} ${props.className}`}>
      <div ref={visJsRef} id="mynetwork" className={classes.canvas} />
    </div>
  );
};

export default NetworkGraph;
