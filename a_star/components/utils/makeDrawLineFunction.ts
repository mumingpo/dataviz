import * as d3 from 'd3';

import type { Line, Vertices } from './types';

function makeDrawLineFunction(vertices: Vertices) {
  return (line: Line) => {
    const from = vertices[line.from];
    const to = vertices[line.to];
    
    const path = d3.path();
    path.moveTo(from.x, from.y);
    path.lineTo(to.x, to.y);

    return path.toString();
  };
}

export default makeDrawLineFunction;
