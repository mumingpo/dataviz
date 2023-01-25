import {
  EDGE_COLOR_VISITING,
  EDGE_COLOR_PERSPECTIVE,
} from './constants';

import type {
  Line,
  SvgNode
} from './types';

type Args = {
  svgNode: SvgNode,
  focus: string,
};

function svgFormatEdges(args: Args) {
  const { svgNode, focus } = args;

  const lineColor = (line: Line) => {
    if ((focus.indexOf(`${line.from}${line.to}`) !== -1) || (focus.indexOf(`${line.to}${line.from}`) !== -1)) {
      return EDGE_COLOR_VISITING;
    }

    if ((focus[focus.length - 1] === line.from) || (focus[focus.length - 1] === line.to)) {
      return EDGE_COLOR_PERSPECTIVE;
    }

    return 'currentcolor';
  }

  const layer = svgNode.selectChild<SVGGElement>('g.edges');

  layer.selectAll<SVGPathElement, Line>('path')
    .style('stroke', lineColor);
  layer.selectAll<SVGTextElement, Line>('text')
    .style('fill', lineColor);
}

export default svgFormatEdges;
