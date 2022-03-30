type Edge = {
    id: string;
    from: string;
    to: string;
};

export function recurseToRoot(start: string, end: string, edges: Edge[]) {
    // get edges coming off of node *start*
    const starting_edges = edges.filter(edge => start.includes(edge.from));

    // recurse from each starting edge to root (0)
    // note there could be multiple starting points
    let combined: { nodes: Node[]; edges: Edge[] } = { nodes: [], edges: [] };
    starting_edges.forEach(edge => {
        const path = recurse(edge, { nodes: [], edges: [] }, edges, end);
        combined = {
            nodes: [...new Set([...path.nodes, ...combined.nodes])],
            edges: [...new Set([...path.edges, ...combined.edges])],
        };
    });

    return combined;
}

function recurse(
    edge: Edge,
    selection: { nodes: any; edges: any },
    edges: any[],
    end: string,
) {
    // cycle or already visited
    if (selection.edges.includes(edge.id)) {
        return selection;
    }

    // add the edge id and nodes at either end of edge to selection
    selection.nodes.push(edge.from, edge.to);
    selection.edges.push(edge.id);

    // cycle or allready visited OR
    if (edge.to === end) {
        return selection;
    } else {
        // find the next edges to go
        // combine both recursion branches together while removing dups
        // return combined branches as one
        let combined: { nodes: Node[]; edges: Edge[] } = {
            nodes: [],
            edges: [],
        };
        edges
            .filter(e => e.from === edge.to)
            .forEach(e => {
                const path = recurse(e, selection, edges, end);
                combined = {
                    nodes: [...new Set([...path.nodes, ...combined.nodes])],
                    edges: [...new Set([...path.edges, ...combined.edges])],
                };
            });

        return combined;
    }
}
