import * as d3 from 'd3';

function svgHydrate(svgNode: d3.Selection<SVGSVGElement, null, null, undefined>) {
  // title
  svgNode.append('text')
    .attr('class', 'title')
    .attr('fill', 'currentcolor')
    .attr('font-size', 'larger')
    .attr('text-anchor', 'end')
    .text('Unemployment vs. Inflation Rate');

  // date
  svgNode.append('text')
    .attr('class', 'date')
    .attr('fill', 'currentcolor')
    .attr('text-anchor', 'end');

  // axis
  svgNode.append('g')
    .attr('class', 'x-axis')
    .append('text')
      .attr('class', 'axis-label');
  svgNode.append('g')
    .attr('class', 'y-axis')
    .append('text')
      .attr('class', 'axis-label');

  // scatter
  svgNode.append('g')
    .attr('class', 'scatter');
}

export default svgHydrate;
