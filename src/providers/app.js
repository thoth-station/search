import * as React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClientProvider } from "react-query";
import { queryClient } from "lib/react-query";
import RouterConfig from "routes/RouterConfig";
import {Button} from "@material-ui/core";
import Theme from "styles/Theme";
import Global from "stores/Global";
import {MainLayout} from "components/Layout";

const ErrorFallback = () => {
	return (
		<div>
			<h2>Oops, something went wrong :( </h2>
			<Button onClick={() => window.location.assign(window.location.origin)}>
                Refresh
			</Button>
		</div>
	);
};

export const AppProvider = () => {
	return (
		<Theme>
			<Global>
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<QueryClientProvider client={queryClient}>
						<MainLayout>
							<RouterConfig />
						</MainLayout>
					</QueryClientProvider>
				</ErrorBoundary>
			</Global>
		</Theme>
	);
};