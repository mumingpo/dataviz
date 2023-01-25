import generalSearchAlgorithm from './general';

import type {
  Vertices,
  Edges,
  CallbackArgs,
  HeuristicFunction,
  ValueFunction,
} from '../types';

type Args = {
  vertices: Vertices,
  edges: Edges,
  callback: (args: CallbackArgs) => void,
};

function uniformCostSearchAlgorithm(args: Args) {
  const { vertices, edges, callback } = args;

  const h: HeuristicFunction = () => {
    return 0;
  };
  const v: ValueFunction = ({ cost }) => (cost);

  generalSearchAlgorithm({ vertices, edges, h, v, callback });
}

export default uniformCostSearchAlgorithm;
