export const PYPI_URL = "https://pypi.org/pypi";
export const THOTH_URL = "https://khemenu.thoth-station.ninja/api/v1";
export const LICENSES_URL =
    "https://raw.githubusercontent.com/spdx/license-list-data/master/json/licenses.json";

/**
 * used for vis-js graph render engine
 */
export const options = {
    manipulation: {
        enabled: false,
        editNode: function (nodeData, callback) {
            nodeData.fixed = !nodeData.fixed.x;
            callback(nodeData);
        },
    },
    interaction: {
        hover: true,
        hoverConnectedEdges: false,
        selectConnectedEdges: false,
        selectable: true,
    },
    edges: {
        chosen: false,
        smooth: false,
        color: {
            color: "#5c6470",
        },
        arrowStrikethrough: false,
        arrows: {
            from: {
                enabled: true,
                type: "triangle",
            },
        },
    },

    nodes: {
        chosen: false,
        color: {
            background: "#5c6470",
            border: "#fff",
            hover: {
                background: "#f39200",
                border: "#fff",
            },
        },
        shape: "dot",
        size: 10,
        borderWidth: 2,
        labelHighlightBold: false,
        font: {
            color: "#393e46",
            strokeWidth: 2,
            size: 15,
        },
    },
    physics: {
        hierarchicalRepulsion: {
            damping: 0.1,
            springLength: 200,
        },
        solver: "hierarchicalRepulsion",
        minVelocity: 0.15,
    },
};
