import { Node, NodeValue } from "lib/interfaces/Node";
import { PackageMergedNodeValue } from "lib/interfaces/PackageMergedNodeValue";

export interface MergedGraph extends Graph<Node<PackageMergedNodeValue>> {
    visEdges: {
        id: number | string;
        to: string;
        from: string;
    }[];
}

/**
 * Graph data structure implemented with an adjacent list
 */
export class Graph<NodeType extends Node<NodeValue>> {
    nodes: Map<NodeType["key"], NodeType>;

    constructor() {
        this.nodes = new Map();
    }

    /**
     * Add a node to the graph.
     */
    addVertex(
        key: NodeType["key"],
        value: NodeType["value"],
        Node: new (key: string, value: NodeType["value"]) => NodeType,
    ): NodeType {
        let node = this.nodes.get(key);
        if (node) {
            return node;
        }

        node = new Node(key, value);
        this.nodes.set(key, node);
        return node;
    }

    /**
     * Create a connection between the source node and the destination node.
     * If the nodes don't exist, then it will make them on the fly.
     */
    addEdge(
        source: NodeType["key"],
        destination: NodeType["key"],
    ): [NodeType | undefined, NodeType | undefined] {
        const sourceNode = this.nodes.get(source);
        const destinationNode = this.nodes.get(destination);

        if (sourceNode && destinationNode) {
            sourceNode.addAdjacent(destinationNode);
        }

        return [sourceNode, destinationNode];
    }

    /**
     * Generic graph search where we can pass a bfs or dfs
     */
    *graphSearch(first: NodeType, type = "bfs"): Generator<NodeType> {
        const visited = new Set();
        const visitList = [];

        visitList.push(first);

        while (visitList.length !== 0) {
            const node = type === "dfs" ? visitList.pop() : visitList.shift();
            if (node && !visited.has(node)) {
                yield node;
                visited.add(node);
                node.getAdjacents().forEach(adj => visitList.push(adj));
            }
        }
    }

    /**
     * Find a path between source and destination
     * It might not be the optimal path
     */
    findPath(
        source: NodeType["key"],
        destination: NodeType["key"],
        path: Set<NodeType> = new Set(),
    ): NodeType[] {
        const sourceNode = this.nodes.get(source);
        const destinationNode = this.nodes.get(destination);
        const newPath = new Set(path);

        if (!destinationNode || !sourceNode) return [];

        newPath.add(sourceNode);

        if (source === destination) {
            return Array.from(newPath);
        }

        // eslint-disable-next-line no-restricted-syntax
        for (const node of sourceNode.getAdjacents()) {
            if (!newPath.has(node)) {
                const nextPath = this.findPath(
                    node.key, // TODO might still be node.value
                    destination,
                    newPath,
                );
                if (nextPath.length) {
                    return nextPath;
                }
            }
        }

        return [];
    }

    findAllNodesOnAllPaths(
        source: NodeType,
        destinationKey: NodeType["key"],
        visited: Map<NodeType["key"], NodeType> = new Map(),
    ): Map<NodeType["key"], NodeType> {
        const visitList: (NodeType | undefined)[] = [];

        visitList.push(source);

        while (visitList.length !== 0) {
            const node = visitList.pop();
            if (node && node.key === destinationKey) {
                continue;
            }
            if (node && !visited.has(node.key)) {
                visited.set(node.key, node);
                node.parents.forEach(parent =>
                    visitList.push(this.nodes.get(parent)),
                );
            }
        }

        return visited;
    }

    /**
     * Find all paths from source to destination
     */
    findAllPaths(
        source: NodeType["key"],
        destination: NodeType["key"],
        path: Set<NodeType> = new Set(),
    ): NodeType[][] {
        const sourceNode = this.nodes.get(source);
        const destinationNode = this.nodes.get(destination);
        const newPath = new Set(path);

        if (!destinationNode || !sourceNode) return [];

        newPath.add(sourceNode);

        if (source === destination) {
            return [Array.from(newPath)];
        }

        const paths: NodeType[][] = [];
        sourceNode.getAdjacents().forEach(node => {
            if (!newPath.has(node)) {
                const nextPaths = this.findAllPaths(
                    node.key, // TODO might need to use node.value.id
                    destination,
                    newPath,
                );
                nextPaths.forEach(nextPath => {
                    paths.push(nextPath);
                });
            }
        });
        return paths;
    }
}
