// react
import React, { useEffect, useRef } from "react";

// utils and configs
import { config } from "./config";

// vis-network
import { Network, DataSet, Data } from "vis-network/standalone";

// Types
import { PackageNodeValue } from "lib/interfaces";
import { useGraph } from "hooks";
import { VisGraphNode } from "lib/interfaces/VisGraphNode";
import { useVisGraphEdges } from "hooks/useVisGraphEdges";

interface IDependencyGraph {
  // advise to create graph from
  analysis_id: string;
  // starting package for the graph
  root?: PackageNodeValue["id"];
  // The height of the graph
  graphHeight?: string | number;
}

/**
 * Renders a network graph visualization using `vis-network`.
 */
const DependencyGraph = ({ analysis_id, root = "*App", graphHeight = "50vh", ...props }: IDependencyGraph) => {
  const visJsRef = useRef<HTMLDivElement>(null);
  const { data: edges } = useVisGraphEdges(analysis_id);
  const { data: graph } = useGraph(analysis_id);

  // create the graph
  useEffect(() => {
    if (!graph || !edges) {
      return;
    }

    const selectedNode = graph.nodes.get(root);

    if (selectedNode) {
      const nodes = graph.findAllNodesOnAllPaths(selectedNode, "*App");

      const app_node = graph.nodes.get("*App");
      if (app_node) {
        nodes.set("*App", app_node);
      }

      // convert to vis graph format
      const convertedNodes = new DataSet<VisGraphNode>();
      nodes.forEach(node => {
        // default colors
        let color = config.nodes.color.background;
        let font = undefined;

        // if node is root
        if (node.key === "*App") {
          color = "#4fc1ea";
          font = { color: "#4fc1ea", strokeWidth: 3, size: 20 };
        }
        // if selected node
        else if (node.key === selectedNode?.key) {
          color = "#f39200";
        }

        convertedNodes.add({
          ...node.value,
          label: node.value.name,
          id: node.key,
          color: color,
          font: font,
        });
      });

      const visData: Data = {
        nodes: convertedNodes,
        edges: new DataSet(edges ?? []),
      };

      const network = visJsRef.current && new Network(visJsRef.current, visData, config);

      // change cursor when hovering and grabbing
      // Get the canvas HTML element
      const networkCanvas = document?.getElementById("mynetwork")?.getElementsByTagName("canvas")[0];

      // changes the cursor graphic depending on where and what the mouse is doing
      const changeCursor = (newCursorStyle: string) => {
        if (networkCanvas) {
          networkCanvas.style.cursor = newCursorStyle;
        }
      };

      if (network) {
        network.on("hoverNode", function () {
          changeCursor("grab");
        });
        network.on("blurNode", function () {
          changeCursor("default");
        });
        network.on("dragStart", function () {
          changeCursor("grabbing");
        });
        network.on("dragging", function () {
          changeCursor("grabbing");
        });
        network.on("dragEnd", function () {
          changeCursor("grab");
        });
      }
    }
  }, [root, graph, visJsRef, edges]);

  return (
    <div {...props} style={{ display: "flex", flexFlow: "column nowrap" }}>
      <div ref={visJsRef} id="mynetwork" style={{ flex: "1 1 auto", height: graphHeight }} />
    </div>
  );
};

export default DependencyGraph;
