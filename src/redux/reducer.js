export function reducer(state, action) {
  switch (action.type) {
    case "graph":
      return { ...state, [action.name]: action.payload };
    case "metric":
      if (!action.label) {
        return {
          ...state,
          metrics: {
            ...state.metrics,
            [action.metric]: action.payload
          }
        };
      } else {
        return {
          ...state,
          metrics: {
            ...state.metrics,
            [action.label]: {
              ...state.metrics?.[action.label],
              [action.metric]: action.payload
            }
          }
        };
      }

    case "error": {
      return {
        ...state,
        error: action.payload
      };
    }
    case "dev": {
      return {
        ...state,
        devMode: action.payload
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
    case "package": {
      return {
        ...state,
        package_data: action.payload
      };
    }
    case "reset": {
      return initState;
    }
    case "localStorage": {
      return action.payload;
    }
    case "focus": {
      return { ...state, focus: action.payload };
    }

    default:
      return state;
  }
}

export const initState = {};
