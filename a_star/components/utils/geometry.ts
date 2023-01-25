import type { Point, Line } from './types';

function distance(A: Point, B: Point) {
  return Math.sqrt(Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2));
}

export {
  distance,
};