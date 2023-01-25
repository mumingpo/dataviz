import type { Heap } from 'heap-js';

// graph generation
export type Point = {
  x: number,
  y: number,
};

export type Vertex = Point & {
  name: string,
};

export type Line = {
  from: string,
  to: string,
};

export type VertexList = Array<Vertex>;
export type Vertices = Record<string, Vertex>;

export type EdgeList = Array<Line>;
export type Edges = Record<string, Record<string, number>>;

export type SvgNode = d3.Selection<SVGSVGElement, null, null, undefined>;

// search algorithm
export type FrontierNode = {
  vertex: string,
  path: string,
  cost: number,
  heuristic: number,
  value: number,
  nodeId: number,
};

export type Path = {
  path: string,
  cost: number,
};

export type AlgorithmType = 'a*' | 'greedy' | 'uniform-cost';

export type HeuristicFunction = (
  args: { vertex: string, context: { vertices: Vertices, edges: Edges } }
) => number;
export type ValueFunction = (
  args: { cost: number, heuristic: number }
) => number;

export type Messages = Array<{ category: string, message: string }>;

export type CallbackArgs = {
  frontier: Heap<FrontierNode>,
  bestPath: Record<string, Path>,
  step: number,
  messages: Messages,
};

export type SearchHistory = {
  step: number,
  path: string,
  frontierSize: number,
  frontierMessages: Array<string>,
  bestPathMessages: Array<string>,
  frontierTopElems: Array<FrontierNode>,
  bestPath: Record<string, Path>,
};
