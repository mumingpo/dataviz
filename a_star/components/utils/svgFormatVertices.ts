import {
  VERTEX_COLOR_ENDPOINTS,
  VERTEX_COLOR_VISITING,
} from './constants';
import type { SvgNode, Vertex } from './types';

type Args = {
  svgNode: SvgNode,
  focus: string,
};

function svgFormatVertices(args: Args) {
  const { svgNode, focus } = args;

  const vertexColor = (vertex: Vertex) => {
    if (vertex.name === 'S' || vertex.name === 'T') {
      return VERTEX_COLOR_ENDPOINTS;
    }
    if (focus.indexOf(vertex.name) === -1) {
      return 'currentcolor';
    }
    return VERTEX_COLOR_VISITING;
  }

  const layer = svgNode.selectChild<SVGGElement>('g.vertices');

  layer.selectAll<SVGCircleElement, Vertex>('circle')
    .style('fill', vertexColor);

  layer.selectAll<SVGTextElement, Vertex>('text')
    .style('fill', vertexColor);
}

export default svgFormatVertices;
