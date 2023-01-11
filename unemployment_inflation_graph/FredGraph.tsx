import * as React from 'react';

import { Box } from '@mantine/core';
import type { Sx } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';

import * as d3 from 'd3';

import { SVG_MAX_WIDTH, SVG_HEIGHT } from './utils/constants';
import type { Data } from './utils/types';

import svgHydrate from './utils/svgHydrate';
import svgMoveText from './utils/svgMoveText';
import svgDrawAxis from './utils/svgDrawAxis';
import svgDrawScatter from './utils/svgDrawScatter';
import svgAnnotateDate from './utils/svgAnnotateDate';
import svgFormatScatter from './utils/svgFormatScatter';

type ComponentProps = {
  data: Data | undefined,
  focus: number,
  sx?: Sx,
};

function FredGraph(props: ComponentProps): JSX.Element {
  const { data, focus, sx } = props;

  const svgRef = React.useRef<SVGSVGElement>(null);
  const { ref: boxRef, width, height } = useElementSize();

  // HACK: preventing React strict mode from hydrating svg twice
  const hydrated = React.useRef<boolean>(false);

  // create svg g elements
  React.useEffect(() => {
    if (!svgRef.current) {
      throw new Error('SVG not loaded before render.')
    }

    if (hydrated.current) {
      return;
    }

    const svgNode = d3.select<SVGSVGElement, null>(svgRef.current);
    svgHydrate(svgNode);

    hydrated.current = true;
  }, []);

  // focus-agnostic svg elements
  React.useEffect(() => {
    if (!svgRef.current) {
      throw new Error('SVG not loaded before render.');
    }

    if (!data) {
      return;
    }

    const svgNode = d3.select<SVGSVGElement, null>(svgRef.current);

    svgMoveText({ svgNode, width, height });
    const [xScale, yScale] = svgDrawAxis({ svgNode, data, width, height });
    svgDrawScatter({ svgNode, data, xScale, yScale });
  }, [width, height, data]);

  // focus-specific svg elements
  React.useEffect(() => {
    if (!svgRef.current) {
      throw new Error('SVG not loaded before render.');
    }

    if (!data) {
      return;
    }

    const svgNode = d3.select<SVGSVGElement, null>(svgRef.current);

    svgAnnotateDate({ svgNode, data, focus });
    svgFormatScatter({ svgNode, data, focus });
  }, [data, focus]);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: SVG_MAX_WIDTH,
        height: SVG_HEIGHT,
        margin: 'auto',
        ...sx,
      }}
      ref={boxRef}
    >
      <svg width={width} height={height} ref={svgRef} />
    </Box>
  );
}

FredGraph.defaultProps = {
  sx: {},
};

export default FredGraph;