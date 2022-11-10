import { useGraph } from "./useGraph";
import { useQuery } from "@tanstack/react-query";

export type DependencyMetricType = {
  /** number of dependencies directly related to root packages */
  direct: number;
  /** number of dependencies directly or indirectly related to the direct packages*/
  indirect: number;
  /** number of dependencies that have no dependents*/
  roots: number;
};

export const useDependencyMetric = (analysis_id: string) => {
  const { data: graph } = useGraph(analysis_id);

  const queryFunction = () => {
    if (!graph || graph?.nodes?.size === 0) {
      throw "no packages found";
    }

    const base: DependencyMetricType = {
      direct: 0,
      indirect: 0,
      roots: 0,
    };

    const root = graph.nodes.get("*App");
    if (root) {
      const bfs = graph.graphSearch(root);
      const nodes = Array.from(bfs);
      const roots = new Set<string>();
      const visited = new Set<string>();

      nodes.forEach(node => {
        if (!visited.has(node.key)) {
          if (node.parents.has("*App")) {
            base.roots += 1;
            roots.add(node.key);
          } else if ([...node.parents].some(k => roots.has(k))) {
            base.direct += 1;
          } else {
            base.indirect += 1;
          }

          visited.add(node.key);
        }
      });
    }

    return base;
  };

  const query = useQuery({
    queryKey: ["dependency_metric", analysis_id],
    enabled: !!graph,
    queryFn: async () => queryFunction(),
  });

  return { data: query.data, isLoading: query.isLoading, isError: query.isError, loadingProgress: null, loadingText: null };
};
