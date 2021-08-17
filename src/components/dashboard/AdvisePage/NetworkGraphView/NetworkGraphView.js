// react
import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useCallback
} from "react";

// utils and configs
import { recurseToRoot } from "./utils";
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
    height: "75vh"
  }
}));

const NetworkGraph = ({
  root,
  search,
  filteredGraph,
  renderPathNodes,
  lockfile,
  ...props
}) => {
  const classes = useStyles();
  const [data, setData] = useState();
  const visJsRef = useRef(null);
  const state = useContext(StateContext);
  const selectedColor = "#f39200";

  const resetAll = useCallback(() => {
    // clear selection
    data.nodes.updateOnly(
      data.nodes.get().map(e => {
        if (e.id !== root) {
          e["opacity"] = 1;
          e["font"] = {
            ...state.mergedGraph.nodes.get(e.id)?.value?.font,
            size: options.nodes.font.size
          };
          e["color"] =
            state.mergedGraph.nodes.get(e.id)?.value?.color ??
            options.nodes.color;
        }
        return e;
      })
    );

    // reset edge colors
    data.edges.updateOnly(
      data.edges.get().map(e => {
        e["color"] = { opacity: 1 };
        return e;
      })
    );
  }, [data, root, state.mergedGraph.nodes]);

  // set the graph to use based on filter
  useEffect(() => {
    if (!filteredGraph || !state.mergedGraph) {
      return;
    }

    let nodes = null;
    if (renderPathNodes) {
      nodes = new Map();
      filteredGraph.nodes.forEach((value, key) => {
        const paths = state.mergedGraph.findAllPaths("*App", key);
        paths.forEach(path => {
          path.forEach(node => {
            nodes.set(node.key, node);
          });
        });
      });
    } else {
      nodes = filteredGraph.nodes;
    }

    // convert to vis graph format
    const convertedNodes = [];
    nodes.forEach(value => {
      if (lockfile === "both" || value.value.lockfile.includes(lockfile)) {
        convertedNodes.push(value.value);
      }
    });
    const visData = {
      nodes: new DataSet(convertedNodes),
      edges: new DataSet(filteredGraph.visEdges)
    };

    setData(visData);
  }, [filteredGraph, state.mergedGraph, lockfile, renderPathNodes]);

  // create the graph
  useEffect(() => {
    if (!data?.nodes) {
      return;
    }

    const network =
      visJsRef.current && new Network(visJsRef.current, data, options);

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
  }, [root, data]);

  // search node
  // recursivly finds all paths from search result to root
  // and grey out nodes that are not in criteria
  useEffect(() => {
    if (!data || !root) {
      return;
    }

    resetAll();

    if (search === "") {
      // reset node colors
      return;
    }

    // use input text to find possible results
    let possible_results = data.nodes.get({
      filter: function(node) {
        return node.label.includes(search);
      }
    });

    // recurse through possible results
    const selected = recurseToRoot(
      possible_results.map(node => node.id),
      root,
      data.edges.map(e => e)
    );

    // grey out non search results
    // edges that are not in search results
    const unselected_edges = data.edges
      .get()
      .filter(edge => !selected.edges.includes(edge.id))
      .map(e => {
        e["color"] = { opacity: 0.05 };
        return e;
      });

    // nodes that are not in search results
    const unselected_nodes = data.nodes
      .get()
      .filter(node => !selected.nodes.includes(node.id))
      .map(e => {
        if (e.id !== root) {
          e["font"] = { size: 0 };
          e["opacity"] = 0.05;
        }
        return e;
      });

    // set searched nodes to a different color
    possible_results = possible_results.map(e => {
      if (e.id !== root) {
        e["color"] = selectedColor;
      }
      return e;
    });

    // update nodes and edges in the dataset
    data.nodes.updateOnly(unselected_nodes.concat(possible_results));
    data.edges.updateOnly(unselected_edges);
  }, [search, data, root, resetAll]);

  return (
    <div className={`${classes.root} ${props.className}`}>
      <div ref={visJsRef} id="mynetwork" className={classes.canvas} />
    </div>
  );
};

export default NetworkGraph;
