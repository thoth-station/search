export function recurseToRoot(start, end, edges) {
  // get edges coming off of node *start*
  const starting_edges = edges.filter(edge => start.includes(edge.from));

  // recurse from each starting edge to root (0)
  // note there could be multiple starting points
  let combined = { nodes: [], edges: [] };
  starting_edges.forEach(edge => {
    const path = recurse(edge, { nodes: [], edges: [] }, edges);
    combined = {
      nodes: [...new Set([...path.nodes, ...combined.nodes])],
      edges: [...new Set([...path.edges, ...combined.edges])]
    };
  });

  return combined;
}

function recurse(edge, selection, edges) {
  // cycle or allready visited OR
  if (selection.edges.includes(edge.id)) {
    return selection;
  }

  // add the edge id and nodes at either end of edge to selection
  selection.nodes.push(edge.from, edge.to);
  selection.edges.push(edge.id);

  // cycle or allready visited OR
  console.log(edge);
  if (edge.to === 0) {
    return selection;
  } else {
    // find the next edges to go
    // combine voth recursion branches together while removing dups
    // return combined branches as one
    let combined = { nodes: [], edges: [] };
    edges
      .filter(e => e.from === edge.to)
      .forEach(e => {
        const path = recurse(e, selection, edges);
        combined = {
          nodes: [...new Set([...path.nodes, ...combined.nodes])],
          edges: [...new Set([...path.edges, ...combined.edges])]
        };
      });

    return combined;
  }
}
