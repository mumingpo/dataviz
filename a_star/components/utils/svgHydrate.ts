import type { SvgNode } from './types';

type Args = {
  svgNode: SvgNode,
};

function svgHydrate(args: Args) {
  const { svgNode } = args
  
  svgNode.append('g')
    .attr('class', 'edges');
  
  svgNode.append('g')
    .attr('class', 'heuristic');

  svgNode.append('g')
    .attr('class', 'vertices');
}

export default svgHydrate;
