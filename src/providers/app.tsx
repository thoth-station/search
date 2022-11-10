import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "lib/react-query";
import { Button } from "@mui/material";
import Theme from "styles/Theme";
import Global, { GlobalState } from "stores/Global";

interface IAppProvider {
  children?: JSX.Element;
  defaultState?: GlobalState;
}

const ErrorFallback = () => {
  return (
    <div>
      <h2>Oops, something went wrong :( </h2>
      <Button onClick={() => window.location.assign(window.location.origin)}>Refresh</Button>
    </div>
  );
};

export const AppProvider: React.FC<IAppProvider> = ({ children, defaultState }) => {
  return (
    <Theme>
      <Global defaultState={defaultState}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </ErrorBoundary>
      </Global>
    </Theme>
  );
};
