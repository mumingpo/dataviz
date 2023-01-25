import {
  EDGE_COLOR_HEURISTIC,
  EDGE_LABEL_HEURISTIC_OFFSET_X,
  EDGE_LABEL_HEURISTIC_OFFSET_Y,
} from './constants';
import { distance } from './geometry';
import makeDrawLineFunction from './makeDrawLineFunction';
import type {
  SvgNode,
  Line,
  EdgeList,
  Vertices,
  AlgorithmType,
} from './types';

type Args = {
  svgNode: SvgNode,
  focus: string,
  vertices: Vertices,
  algorithmType: AlgorithmType,
};

function formatName(line: Line) {
  return `heuristic:${line.from}-${line.to}`;
}

function clear(layer: d3.Selection<SVGGElement, null, null, undefined>) {
  layer.selectAll('path').remove();
  layer.selectAll('text').remove();
}

function svgDrawHeuristic(args: Args) {
  const { svgNode, focus, vertices, algorithmType } = args;

  const layer = svgNode.selectChild<SVGGElement>('g.heuristic');

  if (algorithmType === 'uniform-cost' || focus.length === 0) {
    clear(layer);
    return;
  }

  const from = focus[focus.length - 1];
  const to = 'T';

  if (from === to) {
    clear(layer);
    return;
  }

  const edgeList: EdgeList = [{ from, to }];

  const drawLine = makeDrawLineFunction(vertices);

  const midpointX = (line: Line) => {
    return (vertices[line.from].x + vertices[line.to].x) / 2;
  }

  const midpointY = (line: Line) => {
    return (vertices[line.from].y + vertices[line.to].y) / 2;
  }

  const label = (line: Line) => {
    const dist = distance(vertices[line.from], vertices[line.to]);

    return `h(${line.from})=${dist.toFixed(2)}`;
  };

  layer.selectAll<SVGPathElement, Line>('path')
    .data(edgeList, formatName)
    .join(
      (enter) => (
        enter.append('path')
          .attr('d', drawLine)
      ),
      (update) => (
        update.attr('d', drawLine)
      ),
      (exit) => {
        exit.remove();
      },
    )
    .attr('stroke', EDGE_COLOR_HEURISTIC);

  layer.selectAll<SVGTextElement, Line>('text')
    .data(edgeList, formatName)
    .join('text')
    .attr('x', (line) => (midpointX(line) + EDGE_LABEL_HEURISTIC_OFFSET_X))
    .attr('y', (line) => (midpointY(line) + EDGE_LABEL_HEURISTIC_OFFSET_Y))
    .attr('fill', EDGE_COLOR_HEURISTIC)
    .text(label);
}

export default svgDrawHeuristic;
