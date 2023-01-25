import * as d3 from 'd3';

import {
  MARGIN_LEFT,
  MARGIN_RIGHT,
  MARGIN_TOP,
  MARGIN_BOTTOM,
} from './constants';
import type { SvgNode } from './types';

type MoveTitleArgs = {
  width: number,
  height: number,
  svgNode: SvgNode,
}

function svgMoveText(args: MoveTitleArgs) {
  const { width, height, svgNode } = args;

  const left = width * MARGIN_LEFT;
  const right = width * (1 - MARGIN_RIGHT);
  const top = height * MARGIN_TOP;
  const bottom = height * (1 - MARGIN_BOTTOM);

  svgNode.selectChild('text.title')
    .attr('x', right)
    .attr('y', top + 15);
  
  svgNode.selectChild('text.date')
    .attr('x', right)
    .attr('y', top + 35);
}

export default svgMoveText;
