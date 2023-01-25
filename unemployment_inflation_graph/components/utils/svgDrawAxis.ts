import * as d3 from 'd3';

import {
  MARGIN_LEFT,
  MARGIN_RIGHT,
  MARGIN_TOP,
  MARGIN_BOTTOM,
} from './constants';
import type {
  Data,
  SvgNode,
} from './types';

type DrawAxisArguments = {
  svgNode: SvgNode,
  data: Data,
  width: number,
  height: number,
}

function svgDrawAxis(args: DrawAxisArguments) {
  const { svgNode, data, width, height } = args;

  const xAxisNode = svgNode.selectChild<SVGGElement>('g.x-axis');
  const yAxisNode = svgNode.selectChild<SVGGElement>('g.y-axis');

  const unrateExtent = d3.extent(data, (d) => (d.unrate));
  const unrateMean = d3.mean(data, (d) => (d.unrate));
  const cpiExtent = d3.extent(data, (d) => (d.cpi));
  const cpiMean = d3.mean(data, (d) => (d.cpi));

  if (
    unrateExtent[0] === undefined
    || cpiExtent[0] === undefined
    || unrateMean === undefined
    || cpiMean === undefined
  ) {
    throw new Error('Unable to obtain extent or mean of unrate and cpi.');
  }

  const left = width * MARGIN_LEFT;
  const right = width * (1 - MARGIN_RIGHT);
  const top = height * MARGIN_TOP;
  const bottom = height * (1 - MARGIN_BOTTOM);

  const xScale = d3.scaleLinear()
    .domain(unrateExtent)
    .range([left, right])
    .nice();
  const yScale = d3.scaleLinear()
    .domain(cpiExtent)
    .range([bottom, top])
    .nice();

  const formatPct = (n: d3.NumberValue, _: number) => (`${Math.round(n.valueOf() * 100)}%`); 
  const xAxis = d3.axisTop(xScale)
    .tickFormat(formatPct);
  const yAxis = d3.axisRight(yScale)
    .tickFormat(formatPct);

  const xAxisOffset = yScale(cpiMean);
  const yAxisOffset = xScale(unrateMean);

  xAxisNode
    .attr('transform', `translate(0, ${xAxisOffset})`)
    .call(xAxis);
  yAxisNode
    .attr('transform', `translate(${yAxisOffset}, 0)`)
    .call(yAxis);

  xAxisNode.selectChild<SVGTextElement>('text.axis-label')
    .attr('text-anchor', 'end')
    .attr('x', right)
    .attr('y', 15)
    .attr('fill', 'currentcolor')
    .text('unemployment rate →');
  yAxisNode.selectChild<SVGTextElement>('text.axis-label')
    .attr('text-anchor', 'end')
    .attr('x', -15)
    .attr('y', top + 5)
    .attr('fill', 'currentcolor')
    // .attr('transform', 'rotate(-90)')
    .text('inflation rate ↑');

  return [xScale, yScale] as const;
}

export default svgDrawAxis;
