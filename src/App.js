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
import { reducer, initState } from "redux/reducer";

// context for reducer
export const StateContext = React.createContext();
export const DispatchContext = React.createContext();

function App() {
  // for state control
  const [state, dispatch] = useReducer(reducer, initState);
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
