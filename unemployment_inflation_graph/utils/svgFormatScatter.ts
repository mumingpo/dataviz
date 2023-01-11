import * as d3 from 'd3';

import {
  HALF_LIFE,
  MIN_RADIUS,
  MAX_RADIUS,
  COLOR_HEALTHY,
  COLOR_UNHEALTHY,
  MIN_OPACITY,
} from './constants';
import type { Datum, Data, SvgNode } from './types';

type FormatScatterArgs = {
  svgNode: SvgNode,
  data: Data,
  focus: number,
};

const decayRate = Math.pow(0.5, 1 / HALF_LIFE);

function makeDecayingFunction(focus: number, max: number, min: number) {
  return (d: Datum) => {
    if (d.i > focus) {
      return 0;
    }

    return Math.max(max * Math.pow(decayRate, focus - d.i), min);
  };
}

function makeHealthFunction(data: Data) {
  const unrateTarget = d3.extent(data, (d) => (d.unrate))[0] ?? 0;
  const cpiTarget = 0.02;

  const unrateVar = d3.sum(
    data.map((d) => (Math.pow(d.unrate - unrateTarget, 2))),
  ) / (data.length - 1);
  const cpiVar = d3.sum(
    data.map((d) => (Math.pow(d.cpi - cpiTarget, 2)))
  ) / (data.length - 1);

  const healthFn = (d: Datum) => {
    const component1 = Math.pow(d.unrate - unrateTarget, 2) / unrateVar;
    const component2 = Math.pow(d.cpi - cpiTarget, 2) / cpiVar;

    return Math.pow(component1 + component2, 0.5);
  };

  return healthFn;
}

function makeFormattingFunctions(data: Data, focus: number) {
  const health = makeHealthFunction(data);
  const healths = data.map(health);
  const healthExtent = d3.extent(healths);
  if (healthExtent[0] === undefined) {
    throw new Error('Error while evaluating health of data point.');
  }
  const colorScale = d3.scaleLinear<number, string>()
    .domain(healthExtent)
    // @ts-expect-error d3 type annotation doesn't have color scales implemented
    .range([COLOR_HEALTHY, COLOR_UNHEALTHY]);

  const radius = makeDecayingFunction(focus, MAX_RADIUS, MIN_RADIUS);
  const opacity = makeDecayingFunction(focus, 1, MIN_OPACITY);
  const color = (d: Datum) => {
    const c = d3.color(colorScale(health(d)));
    if (c === null) {
      throw new Error('Error while evaluating color of data point.');
    }
    
    c.opacity = opacity(d);
    return c.formatRgb();
  }

  return { radius, color };
}

function svgFormatScatter(args: FormatScatterArgs) {
  const { svgNode, data, focus } = args;

  const scatterNode = svgNode.selectChild('g.scatter');
  
  const { radius, color } = makeFormattingFunctions(data, focus);

  scatterNode.selectAll<SVGCircleElement, Datum>('circle')
    .join('circle')
    .attr('r', radius)
    .style('fill', color);
}

export default svgFormatScatter;
