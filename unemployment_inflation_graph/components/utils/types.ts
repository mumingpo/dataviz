import * as d3 from 'd3';

export type RawData = {
  DATE: Record<number, string>,
  UNRATE: Record<number, number>,
  CPIAUCSL_PC1: Record<number, number>,
  LICENSE: string,
};
export type Datum = {
  i: number,
  date: Date,
  unrate: number,
  cpi: number,
};
export type Data = Array<Datum>;

export type SvgNode = d3.Selection<SVGSVGElement, null, null, undefined>;
