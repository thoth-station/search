// react
import React, { useEffect, useRef } from "react";

// utils and configs
import { recurseToRoot } from "utils/recurseToRoot";
import { options } from "config/networkOptions";

// vis-network
import { Network } from "vis-network/standalone/esm/vis-network";

// material ui
import SearchBar from "components/Shared/SearchBar";
import { makeStyles } from "@material-ui/core/styles";

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
  const visJsRef = useRef(null);
  const classes = useStyles();
  let network = null;

  useEffect(() => {
    network = visJsRef.current && new Network(visJsRef.current, data, options);

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
  }, [visJsRef, data, network]);

  // recursivly finds all paths from search result to root
  const handleSearch = (query, data, network) => {
    // clear selection if empty search bar
    data.nodes.updateOnly(
      data.nodes.get().map(e => {
        if (e.id !== root) {
          e["color"] = options.nodes.color;
          e["font"] = options.nodes.font;
        }
        return e;
      })
    );

    // reset edge colors
    data.edges.updateOnly(
      data.edges.get().map(e => {
        e["color"] = options.edges.color;
        return e;
      })
    );

    if (query === "") {
      // reset node colors
      return;
    }

    // use input text to find possible results
    let possible_results = data.nodes.get({
      filter: function(node) {
        return node.label.includes(query);
      }
    });

    // recurse through possible results
    const selected = recurseToRoot(
      possible_results.map(node => node.id),
      root,
      data.edges.map(e => e)
    );

    // grey out non search results
    // nodes that are not in search results
    const unselected_edges = data.edges
      .get()
      .filter(edge => !selected.edges.includes(edge.id))
      .map(e => {
        e["color"] = { color: "#e3e5e8" };
        return e;
      });

    // edges that are not in search results
    const unselected_nodes = data.nodes
      .get()
      .filter(node => !selected.nodes.includes(node.id))
      .map(e => {
        if (e.id !== root) {
          e["color"] = { background: "#e3e5e8" };
          e["font"] = { color: "#e3e5e8", strokeWidth: 2, size: 15 };
        }
        return e;
      });

    // set searched nodes to a different color
    possible_results = possible_results.map(e => {
      if (e.id !== root) {
        e["color"] = { background: "#f39200" };
      }
      return e;
    });

    // update nodes and edges in the dataset
    data.nodes.updateOnly(unselected_nodes.concat(possible_results));
    data.edges.updateOnly(unselected_edges);
  };

  return (
    <div className={`${classes.root} ${props.className}`}>
      <SearchBar
        label="Filter packages"
        onChange={text => handleSearch(text, data, network)}
      />
      <div ref={visJsRef} id="mynetwork" className={classes.canvas} />
    </div>
  );
};

export default NetworkGraph;
