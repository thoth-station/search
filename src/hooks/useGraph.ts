import { useAdviseDocument } from "api";
import { Graph, Node } from "lib/interfaces";
import { useQuery } from "@tanstack/react-query";
import { PackageVersionValue } from "lib/interfaces/PackageVersionValue";

/**
 * Given a list of packages, create a graph using metadata information.
 */
export function useGraph(analysis_id?: string) {
  // fetch data
  const { package_list, product } = useAdviseDocument(analysis_id);

  const createGraph = () => {
    if (!(package_list && product)) {
      throw "missing input";
    }

    // create graph
    const graph = new Graph<Node<PackageVersionValue>>();

    const package_dict = new Map<string, typeof package_list[number]>();
    package_list?.forEach(pkg => {
      package_dict.set(pkg.name.toLowerCase(), pkg);
    });

    product?.dependency_graph.nodes.forEach(node => {
      const pkg = package_dict.get(node.toLowerCase());
      if (pkg) {
        const value: PackageVersionValue = pkg;
        graph.addVertex(value.name, value, Node);
      }
    });

    product.dependency_graph.edges.forEach(edge => {
      const sourceNode = graph.nodes.get(product.dependency_graph.nodes?.[edge[0]]?.toLowerCase());
      const destinationNode = graph.nodes.get(product.dependency_graph.nodes?.[edge[1]]?.toLowerCase());
      if (sourceNode && destinationNode) {
        graph.addEdge(sourceNode.key, destinationNode.key);

        // set parent
        destinationNode.parents.add(sourceNode.key);
      }
    });

    // add app node to graph
    const root = graph.addVertex(
      "*App",
      {
        name: "App",
        version: "",
        index: "",
        os_name: "",
        os_version: "",
        python_version: "",
      },
      Node,
    );

    graph.nodes.forEach(node => {
      if (node.parents.size === 0 && node.key !== "*App") {
        graph.addEdge(root.key, node.key);
        node.parents.add(root.key);
      }
    });

    return graph;
  };

  const query = useQuery({
    queryKey: ["graph", analysis_id],
    enabled: !!package_list && !!product,
    queryFn: async () => createGraph(),
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    loadingProgress: null,
    loadingText: "Constructing dependency graph",
  };
}
