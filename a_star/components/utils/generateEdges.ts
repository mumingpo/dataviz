import * as d3 from 'd3';
import seedrandom from 'seedrandom';

import { distance } from './geometry';
import type {
  VertexList,
  Vertices,
  EdgeList,
  Edges,
} from './types';

type Args = {
  vertexList: VertexList,
  vertices: Vertices,
  seed: string,
};

function generateEdges({ vertexList, vertices, seed }: Args) {
  const rng = seedrandom(seed);
  // I really wish there were a better way to iterate through all the edges...
  const { halfedges, hull, triangles } = d3.Delaunay.from(vertexList, (d) => (d.x), (d) => (d.y));
  const edgeList: EdgeList = [];
  const edges: Edges = {};

  // in-edges
  for (let i = 0; i < halfedges.length; i += 1) {
    const j = halfedges[i];
    if (j < i) {
      // j is negative, or (i', j') = (j, i) is already accounted for
      continue;
    }

    const from = vertexList[triangles[i]].name;
    const to = vertexList[triangles[j]].name;

    edgeList.push({ from, to });
  }

  // hull
  for (let i = 0; i < hull.length; i += 1) {
    const from = vertexList[hull[i]].name;
    const toIndex = (i < hull.length - 1) ? i + 1 : 0;
    const to = vertexList[hull[toIndex]].name;

    edgeList.push({ from, to });
  }

  // finished compiling edges, tally in to indexed lookup table
  for (let i = 0; i < edgeList.length; i += 1) {
    const { from, to } = edgeList[i];
    const dist = Math.ceil(
      distance(vertices[from], vertices[to])
      + (1 + rng()) * 10
    );

    if (edges[from] === undefined) {
      edges[from] = {};
    }
    if (edges[to] === undefined) {
      edges[to] = {};
    }

    edges[from][to] = dist;
    edges[to][from] = dist;
  }

  return { edgeList, edges };
}

export default generateEdges;

