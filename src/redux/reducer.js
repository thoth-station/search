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
    case "reset": {
      return initState;
    }

    default:
      return state;
  }
}

export const initState = {
  graph: undefined, // vis-network
  roots: undefined,
  metrics: {
    // metric cards
    dependencies: {
      // counts for dependency types
      all: {
        // aggragate of all root packages (mostly will just be one)
        // roots: undefined, // starting package (has count of 1 unless looking at multiple packages)
        // direct: undefined, // direct dependency count of all root packages
        // indirect: undefined // indirect dependency count of all root packages
      },
      roots: {} // specific root packages and their direct and indirect
      // holds key of package to navigage to it
    },
    licenses: {
      total: undefined,
      all: {} // Map of all licences (key) and and their dependencies (values)
    }
  },
  error: false
};
