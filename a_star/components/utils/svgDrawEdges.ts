import {
  EDGE_LABEL_OFFSET_X,
  EDGE_LABEL_OFFSET_Y,
} from './constants';
import makeDrawLineFunction from './makeDrawLineFunction';
import type {
  SvgNode,
  Line,
  EdgeList,
  Vertices,
  Edges,
} from './types';

type Args = {
  svgNode: SvgNode,
  vertices: Vertices,
  edgeList: EdgeList,
  edges: Edges,
};

function formatName(line: Line) {
  return `${line.from}-${line.to}`;
}

function svgDrawEdges(args: Args) {
  const { svgNode, vertices, edgeList, edges } = args;

  const layer = svgNode.selectChild<SVGGElement>('g.edges');

  const drawLine = makeDrawLineFunction(vertices);

  const midpointX = (line: Line) => {
    return (vertices[line.from].x + vertices[line.to].x) / 2;
  }

  const midpointY = (line: Line) => {
    return (vertices[line.from].y + vertices[line.to].y) / 2;
  }

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
    );

  layer.selectAll<SVGTextElement, Line>('text')
    .data(edgeList, formatName)
    .join('text')
    .attr('x', (line) => (midpointX(line) + EDGE_LABEL_OFFSET_X))
    .attr('y', (line) => (midpointY(line) + EDGE_LABEL_OFFSET_Y))
    .attr('fill', 'currentcolor')
    .text((d) => (edges[d.from][d.to]));
}

export default svgDrawEdges;
