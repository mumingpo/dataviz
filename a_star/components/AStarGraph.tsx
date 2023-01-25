import * as React from 'react';

import * as d3 from 'd3';

import type {
  VertexList,
  Vertices,
  EdgeList,
  Edges,
  AlgorithmType,
} from './utils/types';

import svgHydrate from './utils/svgHydrate';
import svgDrawVertices from './utils/svgDrawVertices';
import svgDrawEdges from './utils/svgDrawEdges';
import svgFormatVertices from './utils/svgFormatVertices';
import svgFormatEdges from './utils/svgFormatEdges';
import svgDrawHeuristic from './utils/svgDrawHeuristic';

type ComponentProps = {
  width: number,
  height: number,
  focus: string,
  vertexList: VertexList,
  vertices: Vertices,
  edgeList: EdgeList,
  edges: Edges,
  algorithmType: AlgorithmType,
}

function AStarGraph(props: ComponentProps): JSX.Element {
  const {
    width,
    height,
    focus,
    vertexList,
    vertices,
    edgeList,
    edges,
    algorithmType,
  } = props;

  const svgRef = React.useRef<SVGSVGElement>(null);
  // HACK: preventing React strict mode from hydrating svg twice
  const hydrated = React.useRef(false);

  // setting up svg layers
  React.useEffect(() => {
    if (!svgRef.current) {
      throw new Error('SVG not loaded upon render. This should not happen, and this error is created to placate TypeScript.')
    }

    if (hydrated.current) {
      return;
    }

    const svgNode = d3.select<SVGSVGElement, null>(svgRef.current);

    svgHydrate({ svgNode });

    hydrated.current = true;;
  }, []);

  // focus-agnostic svg elements
  React.useEffect(() => {
    if (!svgRef.current) {
      throw new Error('SVG not loaded upon render. This should not happen, and this error is created to placate TypeScript.')
    }

    const svgNode = d3.select<SVGSVGElement, null>(svgRef.current);

    svgDrawVertices({ svgNode, vertexList })
    svgDrawEdges({ svgNode, vertices, edgeList, edges });
  }, [vertices, vertexList, edgeList, edges]);

  // focus-specific svg elements
  React.useEffect(() => {
    if (!svgRef.current) {
      throw new Error('SVG not loaded upon render. This should not happen, and this error is created to placate TypeScript.')
    }

    const svgNode = d3.select<SVGSVGElement, null>(svgRef.current);
    svgDrawHeuristic({ svgNode, focus, vertices, algorithmType });
    svgFormatVertices({ svgNode, focus });
    svgFormatEdges({ svgNode, focus });
  }, [vertices, focus, algorithmType]);

  return (
    <svg height={height} width={width} ref={svgRef} />
  );
}

export default AStarGraph;
