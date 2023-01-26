import { QueryClient } from "@tanstack/react-query";

const queryConfig = {
  queries: {
    useErrorBoundary: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });
