```jsx
import { Graph } from "utils/Graph";

const graph = new Graph();
const node1 = graph.addVertex("1", { label: "node 1" });
const node2 = graph.addVertex("2", { label: "node 2" });
const node3 = graph.addVertex("3", { label: "node 3" });
graph.addEdge("1", "2");
graph.addEdge("1", "3");

<AdviseTableView filteredGraph={graph} />;
```
