// local utils and configs
import { themeLight } from "styles/theme";

// ROUTER
import { BrowserRouter } from "react-router-dom";
import { RouterConfig } from "navigation/RouterConfig";
import { REPONAME } from "navigation/CONSTANTS";

// material ui
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

function App() {
  return (
    <MuiThemeProvider theme={themeLight}>
      <CssBaseline />
      <BrowserRouter basename={REPONAME}>
        <RouterConfig />
      </BrowserRouter>
    </MuiThemeProvider>
  );
}

export default App;
