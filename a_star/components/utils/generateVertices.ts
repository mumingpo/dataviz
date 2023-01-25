import seedrandom, { PRNG } from 'seedrandom';

import { X_MARGIN, Y_MARGIN } from './constants';
import { distance } from './geometry';
import type {
  Point,
  Vertex,
  VertexList,
  Vertices,
} from './types';

const A_CHAR_CODE = 'A'.charCodeAt(0);

type Args = {
  n: number,  // number of intermediary points
  width: number,
  height: number,
  seed: string,
  sPos: number,
};

function generateNewPoint(width: number, height: number, rng: PRNG): Point {
  return {
    x: width * (rng() * (1 - 2 * X_MARGIN) + X_MARGIN),
    y: height * (rng() * (1 - 2 * Y_MARGIN) + Y_MARGIN),
  };
}

function generateVertices({n, width, height, seed, sPos}: Args) {
  const rng = seedrandom(seed);

  const S: Vertex = { name: 'S', x: width * sPos, y: height * (1 - sPos) };
  const T: Vertex = { name: 'T', x: width * (1 - X_MARGIN), y: height * Y_MARGIN };

  const vertexList: VertexList = [S, T];

  const minLength = distance(S, T) / (n + 1);

  const perspectiveVertices: Array<Point> = [];

  for (let i = 0; i < n; i += 1) {
    let newPoint = generateNewPoint(width, height, rng);

    // sort of inefficient
    // but graph will be unreadable long before number of points cost significant time
    while (
      Math.min(
        Math.min(...vertexList.map((d) => (distance(d, newPoint)))),
        Math.min(...perspectiveVertices.map((d) => (distance(d, newPoint)))),
      ) < minLength
    ) {
      newPoint = generateNewPoint(width, height, rng);
    }

    perspectiveVertices.push(newPoint);
  }

  // is there a better way to sort the points?
  perspectiveVertices.sort((v1, v2) => (v1.x - v2.x));

  for (let i = 0; i < perspectiveVertices.length; i += 1) {
    vertexList.push({
      ...perspectiveVertices[i],
      name: String.fromCharCode(A_CHAR_CODE + i),
    });
  }

  const vertices: Vertices = Object.fromEntries(vertexList.map((v) => ([v.name, v] as const)));

  return { vertices, vertexList };
}

export default generateVertices;
