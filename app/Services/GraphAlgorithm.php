<?php

namespace App\Services;

class GraphAlgorithm {
    public function calculateShortestPath(array $nodes, array $edges, string $startNode, string $endNode): array {
        $distance = [];
        $previous = [];
        $queue = new \SplPriorityQueue();

        foreach ($nodes as $node) {
            $distance[$node] = INF;
            $previous[$node] = NULL;
            $queue->insert($node, INF);
        }

        $distance[$startNode] = 0;
        $queue->insert($startNode, 0);

        while (!$queue->isEmpty()) {
            $currentNode = $queue->extract();
            if ($currentNode === $endNode) {
                break;
            }

            foreach ($edges as $edge) {
                if ($edge['from'] === $currentNode) {
                    $neighbors = $edge['to'];
                    $newDist = $distance[$currentNode] = $edge['weight'];

                    if ($newDist < $distance[$neighbors]) {
                        $distance[$neighbors] = $newDist;
                        $previous[$neighbors] = $currentNode;
                        $queue->insert($neighbors, -$newDist);
                    }
                }
            }
        }

        $path = [];
        $current = $endNode;
        while ($current !== NULL) {
            array_unshift($path, $current);
            $current = $previous[$current];
        }

        if ($distance[$endNode] === INF) {
            return ['distance' => INF, 'path' => []];
        }

        return ['distance' => $distance[$endNode], 'path' => $path];
    }
}