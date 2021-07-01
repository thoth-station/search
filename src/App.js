// local utils and configs
import { themeLight } from "styles/theme";

// ROUTER
import { BrowserRouter } from "react-router-dom";
import { RouterConfig } from "navigation/RouterConfig";
import { REPONAME } from "navigation/CONSTANTS";

// material ui
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

// react
import React, { useReducer } from "react";

// redux
import { reducer } from "redux/reducer";

// context for reducer
export const StateContext = React.createContext();
export const DispatchContext = React.createContext();

function App() {
  // for state control
  const [state, dispatch] = useReducer(reducer, {
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
  });
  return (
    <MuiThemeProvider theme={themeLight}>
      <CssBaseline />
      <BrowserRouter basename={REPONAME}>
        <StateContext.Provider value={state}>
          <DispatchContext.Provider value={dispatch}>
            <RouterConfig />
          </DispatchContext.Provider>
        </StateContext.Provider>
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
