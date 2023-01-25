import * as d3 from 'd3';
import { Datum, Data, SvgNode } from './types';

type DrawScatterArgs = {
  data: Data,
  svgNode: SvgNode,
  xScale: (n: d3.NumberValue) => number,
  yScale: (n: d3.NumberValue) => number,
};

function svgDrawScatter(args: DrawScatterArgs) {
  const { data, svgNode, xScale, yScale } = args;

  const scatterNode = svgNode.selectChild<SVGGElement>('g.scatter');

  scatterNode.selectAll<SVGCircleElement, Datum>('circle')
    .data(data, (d) => (d.i))
    .join('circle')
    .attr('cx', (d) => (xScale(d.unrate)))
    .attr('cy', (d) => (yScale(d.cpi)));
}

export default svgDrawScatter;
