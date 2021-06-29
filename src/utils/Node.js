/**
 * Graph node/vertex that hold adjacencies nodes
 * For performance, uses a HashSet instead of array for adjacents.
 */
export class Node {
  constructor(key, value) {
    this.adjacents = new Set(); // adjacency list
    this.key = key; // key
    this.value = value;
  }

  /**
   * Add node to adjacency list
   * Runtime: O(1)
   * @param {Node} node
   */
  addAdjacent(node) {
    this.adjacents.add(node);
  }

  /**
   * Check if a Node is adjacent to other
   * Runtime: O(1)
   * @param {Node} node
   */
  isAdjacent(node) {
    return this.adjacents.has(node);
  }

  /**
   * Get all adjacent nodes
   */
  getAdjacents() {
    return Array.from(this.adjacents);
  }
}
