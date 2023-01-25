import {
  VERTEX_RADIUS,
  VERTEX_LABEL_OFFSET_X,
  VERTEX_LABEL_OFFSET_Y,
} from './constants';
import type { SvgNode, Vertex, VertexList } from './types';

type Args = {
  svgNode: SvgNode,
  vertexList: VertexList,
};

function svgDrawVertices(args: Args) {
  const { svgNode, vertexList } = args;

  const layer = svgNode.selectChild<SVGGElement>('g.vertices');

  layer.selectAll<SVGCircleElement, Vertex>('circle')
    .data(vertexList, (d) => (d.name))
    .join('circle')
    .attr('cx', (d) => (d.x))
    .attr('cy', (d) => (d.y))
    .attr('r', VERTEX_RADIUS);

  layer.selectAll<SVGTextElement, Vertex>('text')
    .data(vertexList, (d) => (d.name))
    .join('text')
    .attr('x', (d) => (d.x + VERTEX_LABEL_OFFSET_X))
    .attr('y', (d) => (d.y + VERTEX_LABEL_OFFSET_Y))
    .attr('fill', 'currentcolor')
    .text((d) => (d.name));
}

export default svgDrawVertices;
