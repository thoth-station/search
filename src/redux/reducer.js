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
    case "packageError": {
      return {
        ...state,
        error: action.payload
      };
    }
    case "thothError": {
      return {
        ...state,
        error: action.payload
      };
    }
    case "loading": {
      return {
        ...state,
        loading: action.payload
      };
    }
    case "packageWarning": {
      return {
        ...state,
        packageWarning: action.payload
      };
    }

    default:
      return state;
  }
}
