export function reducer(state, action) {
  switch (action.type) {
    case "metadata":
      return { ...state, metadata: action.payload };
    case "graph":
      return { ...state, graph: action.payload };
    case "metric":
      return {
        ...state,
        metrics: { ...state.metrics, [action.metricName]: action.payload }
      };
    case "metric-field":
      return {
        ...state,
        metrics: {
          ...state.metrics,
          [action.metricName]: {
            ...state.metrics[action.metricName],
            [action.fieldName]: action.payload
          }
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
        error: { [action.who]: action.payload }
      };
    }

    default:
      return state;
  }
}
