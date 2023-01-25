import * as React from 'react';

import axios from 'axios';
import useSWR from 'swr';
// import useSWRImmutable from 'swr/immutable';

import {
  Title,
  Anchor,
  Slider,
  Group,
  Switch,
} from '@mantine/core';

import { IconPlayerPlay, IconPlayerStop } from '@tabler/icons';

import Content from '../../../components/Content';

import FredGraph from '../../../components/dataviz/economy/fredgraph/FredGraph';
import processRawData from '../../../components/dataviz/economy/fredgraph/utils/processRawData';
import { DATA_URL, DELAY } from '../../../components/dataviz/economy/fredgraph/utils/constants';
import type { Data } from '../../../components/dataviz/economy/fredgraph/utils/types';

function InflationAndUnemployment() {
  // const { data: rawData, mutate } = useSWRImmutable<RawData>(
  const { data } = useSWR<Data | undefined>(
    'data/fredgraph',
    () => (axios.get(DATA_URL).then((res) => (processRawData(res.data)))),
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
  // const data = undefined as Data | undefined;
  const dataSize = data ? data.length : 0;

  const [focus, setFocus] = React.useState<number>(data ? data.length - 1 : 0);
  const [autoplay, setAutoPlay] = React.useState<boolean>(false);
  
  // after data loads, automatically go to most recent date
  React.useEffect(() => {
    setFocus(dataSize - 1);
  }, [dataSize]);

  // autoplay
  React.useEffect(() => {
    if (!autoplay) {
      // clearInterval would be handled by the destructor of the previous useEffect hook.
      return;
    }

    setFocus((prevFocus) => {
      if (prevFocus === dataSize - 1) {
        return 0;
      }
      return prevFocus;
    });

    const interval = setInterval(() => {
      setFocus((prevFocus) => {
        const newFocus = prevFocus + 1;
        if (newFocus >= dataSize) {
          setAutoPlay(false);
          return prevFocus;
        }
        return newFocus;
      });
    }, DELAY);

    return () => { clearInterval(interval); };
  }, [autoplay, dataSize]);

  return (
    <Content>
      <Title order={1}>Inflation and Unemployment</Title>
      <p>
        Inflation and unemployment serves as important indicators of the economic status of the U.S.
        This graph, inspired by&nbsp;
        <Anchor href="https://archive.nytimes.com/www.nytimes.com/interactive/2013/10/09/us/yellen-fed-chart.html?_r=1">
          an earlier version from New York Times
        </Anchor>
        , attempts to give a visualization of the state of the U.S. economy at various points in the recent history.
      </p>
      <p>
        Data: U.S. Bureau of Labor Statistics, retrieved from&nbsp;
        <Anchor href="https://fred.stlouisfed.org/graph/?g=3obN">
          St. Louis Fed website
        </Anchor>
        &nbsp;on December 24. 2022.
      </p>
      <p>
        View the source code&nbsp;
        <Anchor href="https://observablehq.com/@mumingpo/inflation-and-unemployment">
          on an Observable notebook
        </Anchor>
        &nbsp;|&nbsp;
        <Anchor href="https://github.com/mumingpo/dataviz/tree/main/unemployment_inflation_graph">
          as implemented in React
        </Anchor>
        .
      </p>
      <FredGraph
        focus={focus}
        data={data}
      />
      <Group style={{ width: '100%' }}>
        <Slider
          value={focus}
          onClick={() => { setAutoPlay(false); }}
          onChange={(newFocus) => {
            setAutoPlay(false);
            setFocus(newFocus);
          }}
          min={0}
          max={data ? data.length - 1 : 0}
          step={1}
          label={(f) => (data ? (data[f]?.date.toLocaleDateString() || '') : '')}
          style={{ flexGrow: 1 }}
        />
        <Switch
          label="autoplay"
          checked={autoplay}
          onChange={(e) => {setAutoPlay(e.currentTarget.checked)}}
          color="teal"
          thumbIcon={ autoplay ? (
              <IconPlayerPlay size={12} color="teal" stroke={3} />
            ) : (
              <IconPlayerStop size={12} color="red" stroke={3} />
            )
          }
        />
      </Group>
    </Content>
  );
}

export default InflationAndUnemployment;
