<?php

namespace App\Http\Controllers;

use App\Models\Graph;
use App\Services\GraphAlgorithm;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GraphController extends Controller
{
    protected $graphAlgorithm;

    public function __construct(GraphAlgorithm $graphAlgorithm) {
        $this->graphAlgorithm = $graphAlgorithm;
    }

    public function upload(Request $request) {
        $request->validate(['file' => 'required|file|mimes:json,csv']);
        $path = $request->file('file')->store('uploads');
        $data = file_get_contents(storage_path('app/' . $path));

        $graphData = json_decode($data, true);
        $graph = Graph::create([
            'nodes' => json_decode($graphData['nodes']),
            'edges' => json_decode($graphData['edges']),
        ]);

        return redirect()->route('graphs.show', $graph->id);
    }

    public function shortestPath(Request $request, $id) {
        $request->validate([
            'start_node' => 'required|string',
            'end_node' => 'required|string',
        ]);

        $graph = Graph::findOrFail($id);
        $nodes = json_decode($graph->nodes, true);
        $edges = json_decode($graph->edges, true);

        $startNode = $request->input("start_node");
        $endNode = $request->input("end_node");

        $result = $this->graphAlgorithm->calculateShortestPath($nodes, $edges, $startNode, $endNode);

        $graph->shortest_path = json_decode($result);
        $graph->save();

        return response()->json($result);
    }

    public function show($id) {
        $graph = Graph::findOrFail($id);
        return Inertia::render('GraphView', [
            'graph' => $graph,
        ]);
    }
}
