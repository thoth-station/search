export function reducer(state, action) {
  switch (action.type) {
    case "graph":
      return { ...state, [action.name]: action.payload };
    case "metric":
      return {
        ...state,
        metrics: {
          ...state.metrics,
          [action.metric]: action.payload
        }
      };
    case "error": {
      return {
        ...state,
        error: action.payload
      };
    }
    case "advise": {
      return {
        ...state,
        advise: {
          ...state.advise,
          [action.param]: action.payload
        }
      };
    }
    case "packageWarning": {
      return {
        ...state,
        packageWarning: action.payload
      };
    }
    case "reset": {
      return initState;
    }
    case "localStorage": {
      return action.payload;
    }

    default:
      return state;
  }
}

export const initState = {};
