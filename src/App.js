// local components
import NetworkGraph from "./components/NetworkGraph"

// local utils and configs
import { getScaleFreeNetwork } from "./utils/getScaleFreeNetwork"
import { themeLight } from "./configs/theme"

// material ui
import { MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";


function App() {
  // construct sample NetworkGraph
  const data = getScaleFreeNetwork(100)

  return (
    <MuiThemeProvider theme={themeLight}>
      <CssBaseline />
        <NetworkGraph data={data}/>
    </MuiThemeProvider>
  );
}

export default App;
