// react
import React, { useEffect, useRef, useState } from "react";

// utils and configs
import { recurseToRoot } from "utils/recurseToRoot";
import { options } from "config/networkOptions";

// vis-network
import {
  Network,
  DataView,
  DataSet
} from "vis-network/standalone/esm/vis-network";

import Graph from "react-graph-vis";

// material ui
import SearchBar from "components/Shared/SearchBar";
import { makeStyles } from "@material-ui/styles";

// styling

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexFlow: "column nowrap"
  },
  canvas: {
    flex: "1 1 auto",
    height: "75vh"
  }
}));

const NetworkGraph = ({ data, searchText, root, ...props }) => {
  const classes = useStyles();
  const [selected, setSelected] = useState(data);

  useEffect(() => {
    const network =
      visJsRef.current && new Network(visJsRef.current, selected, options);

    // set root node to have specific color
    const rootNode = data.nodes.get(root);
    rootNode.color = "#4fc1ea";
    rootNode.font = { color: "#4fc1ea", strokeWidth: 3, size: 20 };
    data.nodes.updateOnly(rootNode);

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
      if (params.nodes.length !== 0) {
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
        network.body.nodes[params.nodes[0]].options.x
      ) {
        // un fix node
        network.editNode(params.nodes[0]);
      }
    });
  }, [root, selected]);

  const visJsRef = useRef(null);

  // recursivly finds all paths from search result to root
  const handleSearch = (query, data) => {
    // clear selection
    data.nodes.updateOnly(
      data.nodes.get().map(e => {
        if (e.id !== root) {
          e["color"] = options.nodes.color;
          e["font"] = options.nodes.font;
        }
        return e;
      })
    );

    if (query.target.value === "") {
      // reset node colors
      setSelected(data);
      return;
    }

    // use input text to find possible results
    let possible_results = data.nodes.get({
      filter: function(node) {
        return node.label.includes(query.target.value);
      }
    });

    // recurse through possible results
    const recurse = recurseToRoot(
      possible_results.map(node => node.id),
      root,
      data.edges.map(e => e)
    );
    setSelected({
      nodes: new DataSet(data.nodes.get(recurse.nodes)),
      edges: new DataSet(data.edges.get(recurse.esges))
    });

    // set searched nodes to a different color
    possible_results = possible_results.map(e => {
      if (e.id !== root) {
        e["color"] = { background: "#f39200" };
      }
      return e;
    });

    // update nodes and edges in the dataset
    data.nodes.updateOnly(possible_results);
  };

  return (
    <div className={`${classes.root} ${props.className}`}>
      <SearchBar
        label="Filter packages"
        onChange={text => handleSearch(text, data)}
      />
      <div ref={visJsRef} id="mynetwork" className={classes.canvas} />
    </div>
  );
};

export default NetworkGraph;
