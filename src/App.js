import React from "react";
import { AppProvider } from "providers/app";
import RouterConfig from "routes/RouterConfig";

function App() {
    return (
        <AppProvider>
            <RouterConfig />
        </AppProvider>
    );
}

export default App;
