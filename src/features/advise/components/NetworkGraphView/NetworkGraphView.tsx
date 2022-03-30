// react
import React, { useEffect, useRef, useContext } from "react";
import ReactDOM from "react-dom";

// utils and configs
import { options } from "config";

// vis-network
import { Network, DataSet, Data } from "vis-network/standalone";

// local
import Popup from "../Popup";
import { SelectedPackageContext } from "../../routes/AdviseDetails";
import { MergedGraph } from "lib/interfaces/Graph";
import { PackageMergedNodeValue } from "../../../../lib/interfaces/PackageMergedNodeValue";

interface INetworkGraph {
    mergedGraph: MergedGraph;
}

/**
 * Renders a network graph visualization using `vis-network`.
 */
const NetworkGraph = ({ mergedGraph, ...props }: INetworkGraph) => {
    const visJsRef = useRef<HTMLDivElement>(null);
    const { selected } = useContext(SelectedPackageContext);

    // create the graph
    useEffect(() => {
        if (!selected || !mergedGraph) {
            return;
        }

        const selectedNode = mergedGraph.nodes.get(selected);

        if (selectedNode) {
            const nodes = mergedGraph.findAllNodesOnAllPaths(
                selectedNode,
                "*App",
            );

            const app_node = mergedGraph.nodes.get("*App");
            if (app_node) {
                nodes.set("*App", app_node);
            }

            // convert to vis graph format
            const convertedNodes = new DataSet<PackageMergedNodeValue>();
            nodes.forEach(value => {
                // popup element
                const popup = document.createElement("div");
                ReactDOM.render(<Popup node={value} />, popup);

                // default colors
                let color = value.value.color ?? options.nodes.color.background;
                let font = undefined;

                // if node is root
                if (value.key === "*App") {
                    color = "#4fc1ea";
                    font = { color: "#4fc1ea", strokeWidth: 3, size: 20 };
                }
                // if selected node
                else if (value.key === selectedNode.key) {
                    color = "#f39200";
                }

                convertedNodes.add({
                    ...value.value,
                    color: color,
                    title:
                        value.key === selectedNode.key || value.key === "*App"
                            ? undefined
                            : popup,
                    font: font,
                });
            });

            const visData: Data = {
                nodes: convertedNodes,
                edges: new DataSet(mergedGraph.visEdges),
            };

            const network =
                visJsRef.current &&
                new Network(visJsRef.current, visData, options);

            // change cursor when hovering and grabbing
            // Get the canvas HTML element
            const networkCanvas = document
                ?.getElementById("mynetwork")
                ?.getElementsByTagName("canvas")[0];

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
    }, [selected, mergedGraph, visJsRef]);

    return (
        <div {...props} style={{ display: "flex", flexFlow: "column nowrap" }}>
            <div
                ref={visJsRef}
                id="mynetwork"
                style={{ flex: "1 1 auto", height: "50vh" }}
            />
        </div>
    );
};

export default NetworkGraph;
