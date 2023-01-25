import generalSearchAlgorithm from './general';

import type {
  Vertices,
  Edges,
  CallbackArgs,
  HeuristicFunction,
  ValueFunction,
} from '../types';
import { distance } from '../geometry';

type Args = {
  vertices: Vertices,
  edges: Edges,
  callback: (args: CallbackArgs) => void,
};

function aStarSearchAlgorithm(args: Args) {
  const { vertices, edges, callback } = args;

  const h: HeuristicFunction = ({ vertex, context }) => {
    const { vertices } = context;

    return distance(vertices[vertex], vertices['T']);
  };
  const v: ValueFunction = ({ cost, heuristic }) => (cost + heuristic);

  generalSearchAlgorithm({ vertices, edges, h, v, callback });
}

export default aStarSearchAlgorithm;
