import * as d3 from 'd3';

export interface Node extends d3.SimulationNodeDatum {
    id: string;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
    vx?: number;
    vy?: number;
    index?: number;
}

// Create a separate interface for D3 simulation edges
export interface SimulationEdge extends d3.SimulationLinkDatum<Node> {
    weight?: number;
}

// Interface for the edges in the input graph
export interface Edge {
    source: string;
    target: string;
    weight?: number;
}

export interface ShortestPath {
    path: string[];
    distance: number;
}

export interface Graph {
    nodes: Node[];
    edges: Edge[];
    shortestPath?: ShortestPath;
}