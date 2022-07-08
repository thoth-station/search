const useProd = true;
export const LOCAL_STORAGE_KEY = "THOTH_SEARCH_ADVISE_HISTORY";
export const THOTH_URL =
  !useProd && (process.env.REACT_APP_DEPLOYMENT === "STAGE" || process.env.NODE_ENV === "development")
    ? "https://stage.thoth-station.ninja/api/v1"
    : "https://khemenu.thoth-station.ninja/api/v1";

/**
 * used for vis-js graph render engine
 */
export const options = {
  manipulation: {
    enabled: false,
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
