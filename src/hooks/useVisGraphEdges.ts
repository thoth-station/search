import { useQuery } from "@tanstack/react-query";
import { useGraph } from "./useGraph";

/**
 * Given a list of packages, create a graph using metadata information.
 */
export function useVisGraphEdges(analysis_id: string) {
  const { data: graph } = useGraph(analysis_id);

  const queryFunction = async () => {
    if (!graph) {
      return;
    }

    const visGraphEdges = new Map<string, { id: string; to: string; from: string }>();

    // add edges from old graph
    graph.nodes.forEach(node => {
      // set package edges
      node.adjacents.forEach(adj => {
        visGraphEdges.set(node.key + adj.key, {
          id: node.key + adj.key,
          to: node.key,
          from: adj.key,
        });
      });
    });
    return Array.from(visGraphEdges.values());
  };

  const query = useQuery({
    queryKey: ["vis_graph_edges", analysis_id],
    enabled: !!graph,
    queryFn: async () => queryFunction(),
  });

  return { data: query.data, isLoading: query.isLoading, loadingProgress: null, loadingText: null };
}
