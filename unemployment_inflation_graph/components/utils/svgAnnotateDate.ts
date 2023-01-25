import type { Data, SvgNode } from './types';

type AnnotateDateArgs = {
  svgNode: SvgNode,
  data: Data,
  focus: number,
};

function svgAnnotateDate(args: AnnotateDateArgs) {
  const { svgNode, data, focus } = args;

  svgNode.selectChild('text.date')
    .text(data[focus]?.date.toLocaleDateString() || '');
}

export default svgAnnotateDate;
