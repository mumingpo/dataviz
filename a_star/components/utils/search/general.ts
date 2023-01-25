import { Heap } from 'heap-js';

import type {
  Vertices,
  Edges,
  FrontierNode,
  Path,
  HeuristicFunction,
  ValueFunction,
  Messages,
  CallbackArgs,
} from '../types';

type Args = {
  h: HeuristicFunction,
  v: ValueFunction,
  vertices: Vertices,
  edges: Edges,
  callback: (args: CallbackArgs) => void,
};

function stringify(node: FrontierNode) {
  return `node {v: ${node.vertex}, path: ${node.path}, value: ${node.value.toFixed(2)}, cost: ${node.cost}}`;
}

function generalSearchAlgorithm(args: Args) {
  const { h, v, vertices, edges, callback } = args;

  const context = { vertices, edges };

  let nodeId = 0;

  const createNode = (vertex: string, path: string, cost: number) => {
    const heuristic = h({ vertex, context });
    const value = v({ cost, heuristic });

    const node = { vertex, path, cost, heuristic, value, nodeId };
    nodeId += 1;
    return node;
  };

  const frontier = new Heap<FrontierNode>((a, b) => (a.value - b.value));
  const bestPath: Record<string, Path> = {};

  let step = 0;

  const initialNode = createNode('S', 'S', 0);
  frontier.init([initialNode]);
  bestPath['S'] = { path: 'S', cost: 0 };
  callback({
    frontier,
    bestPath,
    step,
    messages: [
      { category: 'frontier', message: `Initialized frontier with ${stringify(initialNode)}.` },
      { category: 'best path', message: `Initialized best path to node S with path S and cost 0.`}
    ]
  })


  while(frontier.length > 0) {
    step += 1;
    const messages: Messages = [];

    const node = frontier.pop();
    if (node === undefined) {
      throw new Error('This should not happen.');
    }

    messages.push({ category: 'frontier', message: `Popped minimum element ${stringify(node)} from frontier.` });
    messages.push({ category: 'path', message: node.path });

    if (node.vertex === 'T') {
      messages.push({ category: 'frontier', message: `${stringify(node)} represents shortest path from S to T. Search terminated.`});
      callback({ frontier, bestPath, step, messages });
      return;
    }

    if (bestPath[node.vertex] !== undefined) {
      if (node.cost > bestPath[node.vertex].cost) {
        messages.push({ category: 'frontier', message: `A better path to ${node.vertex} has been previously explored. ${stringify(node)} is discarded.` });
        callback({ frontier, bestPath, step, messages });
        continue;
      }
    }

    const neighbors = Object.entries(edges[node.vertex]);

    neighbors.forEach(([neighborName, edgeCost]) => {
      const neighborCost = node.cost + edgeCost;
      const neighborPath = node.path + neighborName;
      const neighborNode = createNode(neighborName, neighborPath, neighborCost);

      if (bestPath[neighborName] !== undefined) {
        if (neighborCost >= bestPath[neighborName].cost) {
          messages.push({ category: 'frontier', message: `A better path to ${neighborName} has been previously explored. ${stringify(neighborNode)} will not be added to the frontier.` });
          return;
        }
      }

      frontier.push(neighborNode);
      messages.push({ category: 'frontier', message: `Neighbor ${stringify(neighborNode)} has been added to the frontier.`})

      bestPath[neighborName] = {
        path: neighborPath,
        cost: neighborCost,
      };
      messages.push({ category: 'best path', message: `Best path to reach ${neighborName} is now via ${neighborPath} with cost ${neighborCost}`});
    });

    callback({ frontier, bestPath, step, messages });
  }

  step += 1;
  callback({ frontier, bestPath, step, messages: [{ category: 'frontier', message: 'Frontier depleted. T unreachable from S.'}]})
}

export default generalSearchAlgorithm;
