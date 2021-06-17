import { DataSet } from "vis-network/standalone/esm/vis-network";

export function getScaleFreeNetwork(nodeCount) {
  const nodes = [];
  const edges = [];
  const connectionCount = [];

  // randomly create some nodes and edges
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      id: i,
      label: String(i)
    });

    connectionCount[i] = 0;

    // create edges in a scale-free-network way
    if (i === 1) {
      const from = i;
      const to = 0;
      edges.push({
        from: from,
        to: to
      });
      connectionCount[from]++;
      connectionCount[to]++;
    } else if (i > 1) {
      const conn = edges.length * 2;
      const rand = Math.floor(Math.random() * conn);
      let cum = 0;
      let j = 0;
      while (j < connectionCount.length && cum < rand) {
        cum += connectionCount[j];
        j++;
      }

      const from = i;
      const to = j;
      edges.push({
        from: from,
        to: to
      });
      connectionCount[from]++;
      connectionCount[to]++;
    }
  }

  return {
    nodes: new DataSet(nodes),
    edges: new DataSet(edges)
  };
}
