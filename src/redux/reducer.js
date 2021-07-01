export function reducer(state, action) {
  switch (action.type) {
    case "graph":
      return { ...state, graph: action.payload };
    case "roots":
      return { ...state, roots: action.payload };
    case "metric":
      return {
        ...state,
        metrics: {
          ...state.metrics,
          [action.metric]: action.payload
        }
      };
    case "warning": {
      return {
        ...state,
        warning: action.payload
      };
    }
    case "error": {
      return {
        ...state,
        error: action.payload
      };
    }

    default:
      return state;
  }
}
