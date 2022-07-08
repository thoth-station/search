export interface NodeValue {
  [key: string]: unknown;
}

/**
 * Graph node/vertex that hold adjacency nodes
 * For performance, uses a HashSet instead of array for adjacent.
 */
export class Node<GenericNodeValue extends NodeValue> {
  /** Nodes connected (children) to this node **/
  adjacents: Set<this>;
  /** the unique identifier **/
  key: string;
  value: GenericNodeValue;
  /** Nodes connected (parents) to this node **/
  parents: Set<string>;

  constructor(key: string, value: GenericNodeValue) {
    this.adjacents = new Set(); // adjacency list
    this.key = key; // key
    this.value = value;
    this.parents = new Set<string>();
  }

  /**
   * Add node to adjacency list
   * Runtime: O(1)
   * @param {this} node
   */
  addAdjacent(node: this) {
    this.adjacents.add(node);
  }

  /**
   * Check if a Node is adjacent to other
   * Runtime: O(1)
   * @param {this} node
   */
  isAdjacent(node: this) {
    return this.adjacents.has(node);
  }

  /**
   * Get all adjacent nodes
   */
  getAdjacents() {
    return Array.from(this.adjacents);
  }
}
