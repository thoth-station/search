// react
import React, { useEffect, useRef, useContext } from "react";
import ReactDOM from "react-dom";

// utils and configs
import { options } from "config";

// vis-network
import { Network, DataSet } from "vis-network/standalone";

// material ui
import { makeStyles } from "@material-ui/styles";

// local
import Popup from "../Popup";
import { SelectedPackageContext } from "../../routes/AdviseDetails";
import PropTypes from "prop-types";
import { Graph } from "utils/Graph";

const useStyles = makeStyles(() => ({
    root: {
        display: "flex",
        flexFlow: "column nowrap",
    },
    canvas: {
        flex: "1 1 auto",
        height: "50vh",
    },
}));

/**
 * Renders a network graph visualization using `vis-network`.
 */
const NetworkGraph = ({ mergedGraph, ...props }) => {
    const classes = useStyles();
    const visJsRef = useRef(null);
    const { selected } = useContext(SelectedPackageContext);

    // create the graph
    useEffect(() => {
        if (!selected || !mergedGraph) {
            return;
        }

        const selectedNode = mergedGraph.nodes.get(selected);

        let nodes = mergedGraph.findAllNodesOnAllPaths(selectedNode, "*App");

        nodes.set("*App", mergedGraph.nodes.get("*App"));

        // convert to vis graph format
        const convertedNodes = new DataSet();
        nodes.forEach(value => {
            // popup element
            const popup = document.createElement("div");
            ReactDOM.render(<Popup node={value} />, popup);

            // default colors
            let color = value.value.color ?? options.nodes.color;
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
        const visData = {
            nodes: convertedNodes,
            edges: new DataSet(mergedGraph.visEdges),
        };

        const network =
            visJsRef.current && new Network(visJsRef.current, visData, options);

        // change curser when hovering and grabbing
        // Get the canvas HTML element
        var networkCanvas = document
            .getElementById("mynetwork")
            .getElementsByTagName("canvas")[0];

        // changes the curser graphic depedning on where and what the mouse is doing
        function changeCursor(newCursorStyle) {
            networkCanvas.style.cursor = newCursorStyle;
        }
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

        // fix (stick in place) node when done dragging
        network.on("dragEnd", function (params) {
            if (
                params.nodes.length !== 0 &&
                !network.isCluster(params.nodes[0])
            ) {
                network.editNode(params.nodes[0]);
            }
        });

        // hover over node
        network.on("dragEnd", function (params) {
            if (
                params.nodes.length !== 0 &&
                !network.isCluster(params.nodes[0])
            ) {
                network.editNode(params.nodes[0]);
            }
        });
    }, [selected, mergedGraph]);

    return (
        <div className={`${classes.root} ${props.className}`}>
            <div ref={visJsRef} id="mynetwork" className={classes.canvas} />
        </div>
    );
};

NetworkGraph.propTypes = {
    mergedGraph: PropTypes.objectOf(Graph),
    className: PropTypes.any,
};

export default NetworkGraph;
