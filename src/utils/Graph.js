import { Node } from "utils/Node";

/**
 * Graph data structure implemented with an adjacent list
 */
export class Graph {
	constructor() {
		this.nodes = new Map();
	}

	/**
   * Add a node to the graph.
   */
	addVertex(key, value) {
		if (this.nodes.has(key)) {
			return this.nodes.get(key);
		}

		const vertex = new Node(key, value);
		this.nodes.set(key, vertex);
		return vertex;
	}

	/**
   * Create a connection between the source node and the destination node.
   * If the nodes don't exist, then it will make them on the fly.
   */
	addEdge(source, destination) {
		const sourceNode = this.nodes.get(source);
		const destinationNode = this.nodes.get(destination);

		sourceNode.addAdjacent(destinationNode);

		return [sourceNode, destinationNode];
	}

	/**
   * True if two nodes are adjacent.
   */
	areAdjacents(source, destination) {
		const sourceNode = this.nodes.get(source);
		const destinationNode = this.nodes.get(destination);

		if (sourceNode && destinationNode) {
			return sourceNode.isAdjacent(destinationNode);
		}

		return false;
	}

	/**
   * Generic graph search where we can pass a bfs or dfs
   */
	*graphSearch(first, type = "bfs") {
		const visited = new Map();
		const visitList = [];

		visitList.push(first);

		while (visitList.length !== 0) {
			const node = type === "dfs" ? visitList.pop() : visitList.shift();
			if (node && !visited.has(node)) {
				yield node;
				visited.set(node);
				node.getAdjacents().forEach(adj => visitList.push(adj));
			}
		}
	}

	/**
   * Find a path between source and destination
   * It might not be the optimal path
   */
	findPath(source, destination, path = new Map()) {
		const sourceNode = this.nodes.get(source);
		const destinationNode = this.nodes.get(destination);
		const newPath = new Map(path);

		if (!destinationNode || !sourceNode) return [];

		newPath.set(sourceNode);

		if (source === destination) {
			return Array.from(newPath.keys());
		}

		// eslint-disable-next-line no-restricted-syntax
		for (const node of sourceNode.getAdjacents()) {
			if (!newPath.has(node)) {
				const nextPath = this.findPath(node.value, destination, newPath);
				if (nextPath.length) {
					return nextPath;
				}
			}
		}

		return [];
	}

	findAllNodesOnAllPaths(source, destination, visited = new Map()) {
		const visitList = [];

		visitList.push(source);

		while (visitList.length !== 0) {
			const node = visitList.pop();
			if (node.key === destination) {
				continue;
			}
			if (node && !visited.has(node.key)) {
				visited.set(node.key, node);
				node.parents.forEach(parent => visitList.push(this.nodes.get(parent)));
			}
		}

		return visited;
	}

	/**
   * Find all paths from source to destination
   */
	findAllPaths(source, destination, path = new Map()) {
		const sourceNode = this.nodes.get(source);
		const destinationNode = this.nodes.get(destination);
		const newPath = new Map(path);

		if (!destinationNode || !sourceNode) return [];

		newPath.set(sourceNode);

		if (source === destination) {
			return [Array.from(newPath.keys())];
		}

		const paths = [];
		sourceNode.getAdjacents().forEach(node => {
			if (!newPath.has(node)) {
				const nextPaths = this.findAllPaths(
					node.value.id,
					destination,
					newPath
				);
				nextPaths.forEach(nextPath => {
					paths.push(nextPath);
				});
			}
		});
		return paths;
	}
}
