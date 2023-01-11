import type { RawData, Data } from './types';

function processRawData(rawData: RawData) {
  const { DATE, UNRATE, CPIAUCSL_PC1 } = rawData;
  if (
    DATE === undefined
    || UNRATE === undefined
    || CPIAUCSL_PC1 === undefined
  ) {
    return undefined;
  }
  const dataSize = Object.keys(DATE).length;
  const data: Data = Array.from({ length: dataSize }, (_, i) => ({
    i,
    date: new Date(DATE[i]),
    unrate: UNRATE[i] / 100,
    cpi: CPIAUCSL_PC1[i] / 100,
  }));

  return data;
}

export default processRawData;
