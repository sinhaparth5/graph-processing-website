import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface NodeDatum extends d3.SimulationNodeDatum {
    id: string;
}

interface EdgeDatum {
    source: string;
    target: string;
    weight: number;
}

interface GraphData {
    nodes: NodeDatum[];
    edges: EdgeDatum[];
}

interface GraphProps {
    graph: {
        id: number;
        nodes: string;
        edges: string;
    };
}

const GraphView: React.FC<GraphProps> = ({ graph }) => {
    const svgRef = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (!graph) return;

        const nodes: NodeDatum[] = JSON.parse(graph.nodes).map((id: string) => ({ id }));
        const edges: EdgeDatum[] = JSON.parse(graph.edges);
        const data: GraphData = { nodes, edges };

        const width = 800;
        const height = 600;

        const svg = d3.select(svgRef.current)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .style('width', '100%')
            .style('height', '100%');

        const simulation = d3.forceSimulation<NodeDatum>(data.nodes)
            .force('link', d3.forceLink<NodeDatum, EdgeDatum>(data.edges).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2));

        const dragBehavior = d3.drag<SVGCircleElement, NodeDatum>()
            .on("start", (event: d3.D3DragEvent<SVGCircleElement, NodeDatum, NodeDatum>, d: NodeDatum) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            })
            .on("drag", (event: d3.D3DragEvent<SVGCircleElement, NodeDatum, NodeDatum>, d: NodeDatum) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event: d3.D3DragEvent<SVGCircleElement, NodeDatum, NodeDatum>, d: NodeDatum) => {
                if (!event.active) simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            });

        const link = svg.append('g')
            .attr('stroke', '#999')
            .attr('stroke-opacity', 0.6)
            .selectAll<SVGLineElement, EdgeDatum>('line')
            .data(data.edges)
            .join('line')
            .attr('stroke-width', d => Math.sqrt(d.weight));

        const node = svg.append('g')
            .attr('stroke', '#fff')
            .attr('stroke-width', 1.5)
            .selectAll<SVGCircleElement, NodeDatum>('circle')
            .data(data.nodes)
            .join('circle')
            .attr('r', 10)
            .attr('fill', '#69b3a2')
            .call(dragBehavior); // Apply drag behavior here without passing simulation directly

        const labels = svg.append('g')
            .selectAll<SVGTextElement, NodeDatum>('text')
            .data(data.nodes)
            .join('text')
            .text(d => d.id)
            .attr('font-size', '10px')
            .attr('fill', '#333');

        simulation.on('tick', () => {
            link
                .attr('x1', d => (d as any).source.x)
                .attr('y1', d => (d as any).source.y)
                .attr('x2', d => (d as any).target.x)
                .attr('y2', d => (d as any).target.y);

            node
                .attr('cx', d => d.x!)
                .attr('cy', d => d.y!);

            labels
                .attr('x', d => d.x!)
                .attr('y', d => d.y!);
        });
    }, [graph]);

    return <svg ref={svgRef} className="border rounded-lg shadow-md"></svg>;
};

export default GraphView;
