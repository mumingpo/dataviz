import * as React from 'react';

import {
  Box,
  Title,
  Slider,
  ActionIcon,
  Group,
  Text,
  Space,
  Center,
  Select,
  Divider,
  TextInput,
  Anchor,
} from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowForward,
  IconRefresh,
} from '@tabler/icons';

import {
  SVG_MAX_WIDTH,
  SVG_HEIGHT,
  DEFAULT_N,
  DEFAULT_S_POSITION,
} from '../../../components/dataviz/ai/astar/utils/constants';
import type { CallbackArgs, SearchHistory } from '../../../components/dataviz/ai/astar/utils/types';

import AStarGraph from '../../../components/dataviz/ai/astar/AStarGraph';
import generateVertices from '../../../components/dataviz/ai/astar/utils/generateVertices';
import generateEdges from '../../../components/dataviz/ai/astar/utils/generateEdges';

import aStarSearchAlgorithm from '../../../components/dataviz/ai/astar/utils/search/aStar';
import uniformCostSearchAlgorithm from '../../../components/dataviz/ai/astar/utils/search/uniformCost';
import greedyAlgorithm from '../../../components/dataviz/ai/astar/utils/search/greedy';

import Content from '../../../components/Content';
import usePageNav from '../../../hooks/usePageNav';
import PageAnchor from '../../../components/layout/PageAnchor';

const ALLOWED_ALGORITHM_TYPES = ['a*', 'uniform-cost', 'greedy'] as const;

function AStar(): JSX.Element {
  usePageNav();
  const { width, height, ref: boxRef } = useElementSize();
  const [nSliderVal, setNSliderVal] = React.useState(DEFAULT_N);
  const [posSliderVal, setPosSliderVal] = React.useState(DEFAULT_S_POSITION);
  const [focus, setFocus] = React.useState('');
  const rendered = React.useRef(false);

  const [seed, setSeed] = React.useState('0');
  const [typedSeed, setTypedSeed] = React.useState(seed);

  // avoid initial render
  const [{ vertexList, vertices}, setV] = React.useState(
    () => (generateVertices({ n: 0, width, height, seed: '0', sPos: DEFAULT_S_POSITION })),
  );
  const { edgeList, edges } = React.useMemo(
    () => (generateEdges({ vertexList, vertices, seed })),
    [vertexList, vertices, seed],
  );

  const reloadGraph = React.useMemo(() => ((n: number, seed: string) => {
    setSeed(seed);
    setTypedSeed(seed);
    setV(generateVertices({ n, width, height, seed, sPos: posSliderVal }))
  }), [width, height, posSliderVal]);

  const reloadButton = (
    <ActionIcon
      title="reload"
      variant="outline"
      onClick={() => {
        reloadGraph(nSliderVal, typedSeed);
      }}
    >
      <IconArrowForward color="teal" />
    </ActionIcon>
  );
  const randomizeButton = (
    <ActionIcon
      title="randomize"
      variant="outline"
      onClick={() => {
        const randomNumberString = `${Math.round(Math.random() * 1000000)}`;
        reloadGraph(nSliderVal, randomNumberString);
      }}
    >
      <IconRefresh color="teal" />
    </ActionIcon>
  );

  const [algorithmType, setAlgorithmType] = React.useState<(typeof ALLOWED_ALGORITHM_TYPES)[number]>('a*');

  const [searchHistory, setSearchHistory] = React.useState<Array<SearchHistory>>([]);
  const [currentStep, setCurrentStep] = React.useState(0);

  // HACK: use width > 0 and height > 0 to bypass prerendering in Next.
  React.useEffect(() => {
    if (rendered.current) {
      return;
    }

    if (width > 0 && height > 0) {
      reloadGraph(DEFAULT_N, '0');
      rendered.current = true;
    }
  }, [width, height, reloadGraph]);

  // restart search every time points have been rendered.
  React.useEffect(() => {
    setCurrentStep(0);
    setSearchHistory([]);
    const callback = ({ frontier, bestPath, step, messages }: CallbackArgs) => {
      let path = '';
      const frontierSize = frontier.length;
      const frontierMessages: Array<string> = [];
      const bestPathMessages: Array<string> = [];
      const frontierTopElems = [...frontier.top(5)].sort((a, b) => (a.value - b.value));
      const bestPathCopy = { ...bestPath };

      messages.forEach(({ category, message }) => {
        if (category === 'path') {
          path = message;
        }

        if (category === 'frontier') {
          frontierMessages.push(message);
        }
        
        if (category === 'best path') {
          bestPathMessages.push(message);
        }
      });

      const historyEntry: SearchHistory = {
        step,
        path,
        frontierSize,
        frontierMessages,
        bestPathMessages,
        frontierTopElems,
        bestPath: bestPathCopy,
      };

      setSearchHistory((prev) => ([...prev, historyEntry]));
    }
    if (algorithmType === 'a*') {
      aStarSearchAlgorithm({ vertices, edges, callback });
    } else if (algorithmType === 'greedy') {
      greedyAlgorithm({ vertices, edges, callback });
    } else if (algorithmType === 'uniform-cost') {
      uniformCostSearchAlgorithm({ vertices, edges, callback });
    }
  }, [vertices, edges, algorithmType]);

  React.useEffect(() => {
    if (currentStep >= searchHistory.length) {
      setFocus('');
    } else {
      setFocus(searchHistory[currentStep].path);
    }
  }, [searchHistory, currentStep]);

  const graph = (
    <Box
      ref={boxRef}
      sx={{
        width: '100%',
        maxWidth: SVG_MAX_WIDTH,
        height: SVG_HEIGHT,
        margin: 'auto',
      }}
    >
      <AStarGraph
        width={width}
        height={height}
        focus={focus}
        vertexList={vertexList}
        vertices={vertices}
        edgeList={edgeList}
        edges={edges}
        algorithmType={algorithmType}
      />
    </Box>
  );

  return (
    <Content>
      <Title order={1}>
        A* Search Algorithm
      </Title>
      <Space h="md" />
      <PageAnchor anchorKey="introduction" label="Introduction" />
      <Title order={2}>
        Introduction
      </Title>
      <p>
        The A* (pronounced A-Star) search is a fascinating algorithm in artificial intelligence.
        The problem provides a good entry-level introduction to the field of AI, while also
        demonstrating how we may harness the power of clever heuristics to provide a massive boost
        in the efficiency of our algorithms.
      </p>
      <PageAnchor anchorKey="problem_statement" label="Problem statement" />
      <Title order={2}>
        Problem statement
      </Title>
      <p>
        Given a map of cities and road, along with the cost (may represent distance or time) it takes to traverse each,
        how do we find an optimal path from S to T? (cost may not be negative)
      </p>
      { graph }
      <Group grow>
        <Text>
          Number of intermediary vertices: &nbsp;
          {nSliderVal}
        </Text>
        <Slider
          value={nSliderVal}
          onChange={setNSliderVal}
          min={0}
          max={'S'.charCodeAt(0) - 'A'.charCodeAt(0)}
          defaultValue={5}
        />
      </Group>
      <Group grow>
        <Text>
          S position: &nbsp;
          {posSliderVal.toFixed(1)}
        </Text>
        <Slider
          value={posSliderVal}
          label={posSliderVal.toFixed(1)}
          onChange={setPosSliderVal}
          min={0.1}
          max={0.5}
          step={0.1}
          defaultValue={0.1}
        />
      </Group>
      <Group>
        <Text>Random seed: </Text>
        <TextInput
          aria-label="Random seed"
          placeholder="enter random seed"
          value={typedSeed}
          onChange={(event) => (setTypedSeed(event.currentTarget.value))}
        />
        {reloadButton}
        {randomizeButton}
      </Group>
      <Space h="md" />
      <PageAnchor anchorKey="naive_attempts" label="Naïve attempts" />
      <Title order={2}>
        Naïve attempts
      </Title>
      <p>
        <b>Attempt #1 (random walk):</b> We may draw some different nice-looking paths between S and T,
        sum up the costs along each route, and find the path with minimum cost from our bunch.
      </p>
      <ul>
        <li>
          <b>Pro:</b> Easy to understand and implement.
        </li>
        <li>
          <b>Con:</b> There is no guarantee on the quality of the solution.
        </li>
      </ul>
      <p>
        <b>Attempt #2 (exhaustive BFS):</b> We may iterate through every possible path that begins in S,
        traverse each city at most once, and ends in T. 
      </p>
      <ul>
        <li>
          <b>Pro:</b> Guarantees the optimality of the solution.
        </li>
        <li>
          <b>Con:</b> Search space is very large (exponential time complexity), take ages to complete.
        </li>
      </ul>
      <p>
        <b>Attempt #3 (uniform-cost search):</b> We may start from S, and gradually expand outwards to explore paths
        of ever increasing lengths.
      </p>
      <ul>
        <li>
          <b>Pro:</b> Drastically more efficient than an exhaustive search while still maintaining the optimality of the solution.
        </li>
        <li>
          <b>Con:</b> Search space is still very large. Also, a lot of effort is spent on evaluating paths that
          are unconstructive to our goal of reaching T. To reach Boston, MA. from Denver, CO., our algorithm would
          most likely visit Los Angeles, CA. even though there is clearly no point taking the trip west.
        </li>
      </ul>
      <p>
        <b>Attempt #4 (greedy search):</b> We may start from S, and only explore the edge that brings us the closest
        to our destination based on some guess of remaining distance (heuristics).
      </p>
      <ul>
        <li>
          <b>Pro:</b> Time complexity is now almost trivial.
        </li>
        <li>
          <b>Con:</b> We lost our optimality guarantee. To cross a river, our algorithm would set its gaze on the other
          side and blindly wade through the streams instead of looking for a bridge.
        </li>
      </ul>
      <PageAnchor anchorKey="combining_methodologies" label="Combining methodologies" />
      <Title order={2}>
        Combining methodologies
      </Title>
      <p>
        Attempt #3 and attempt #4 looks almost complementary. Attempt #3 merticulously examines the shortest paths with no
        sense of the big picture, while attempt #4 only looks at the big picture and neglects details. If only
        there were a way to combine these two methods...
      </p>
      <p><i>... drum rolls...</i></p>
      <PageAnchor anchorKey="algorithm" label="Algorithm" />
      <Title order={2}>
        Algorithm
      </Title>
      <p>
        Starting with cost function c(K) and a heuristic function h(K) that estimates the remaining distance from K to T,
        our algorithm goes as followed:
      </p>
      <ol>
        <li>
          Maintain a frontier that keeps track of the following information:
          <ul>
            <li>
              vertex (e.g. K)
            </li>
            <li>
              estimated total cost by adding the cost of the path with the heuristic remaining distance (e.g. c(SACK) + h(K))
            </li>
            <li>
              path traversed to reach target vertex (e.g. S-A-C-K), with cost of said path
            </li>
          </ul>
          The frontier should be initialized with S with a cost of 0.
        </li>
        <li>
          Maintain a list of best paths to each node.
        </li>
        <li>
          While nodes remain in the frontier, do:
          <ol>
            <li>
              Pop the node with smallest estimated total cost.
            </li>
            <li>
              If the node is our destination, it represents the shortest path that we desire, and the algorithm may terminate.
            </li>
            <li>
              If the node has been found to have a shorter path during the time it is in the frontier, discard it.
            </li>
            <li>
              For all its neighbors:
            </li>
            <ol>
              <li>
                Generate a new node of the neighbor by using the original path.
              </li>
              <li>
                If the path is suboptimal than a prior path to the neighbor, discard it.
              </li>
              <li>
                Add the new node to frontier and update best paths.
              </li>
            </ol>
          </ol>
        </li>
        <li>
          If the frontier has been exhausted but T still has not been reached, there is no path between S and T.
        </li>
      </ol>
      <PageAnchor anchorKey="caveats" label="Caveats" />
      <Title order={3}>
        Caveats
      </Title>
      <ul>
        <li>
          The heuristic function must be &quot;admissible&quot; to guarantee an optimal solution.
          That is, it must never overestimate the distance between any node and T.
          In real world, the Euclidean distance is frequently used.
        </li>
        <li>
          An inadmissible heuristic function, while invalidating the optimality guarantee,
          still provides useful speed ups in many applications.
        </li>
        <li>
          The better the heuristic function is in estimating the target node, the more efficient the algorithm becomes.
        </li>
        <li>
          Because of the frequent updates and retrivals of the minimum element, the most efficient data structure
          for the frontier is the&nbsp;
          <Anchor href="https://en.wikipedia.org/wiki/Binary_heap">
            min heap
          </Anchor>
          .
        </li>
      </ul>
      <PageAnchor anchorKey="proof" label="Why it works" />
      <Title order={2}>Why it works</Title>
      <ul>
        <li>
          All nodes in the connected component of S will be added to the frontier at some point.
        </li>
        <li>
          The estimated total cost for any node is always less than or equal to the cost of
          any S-T route through its path.
        </li>
        <li>
          h(T) must be 0, because the distance between T and itself is 0. As such, the estimated
          total cost of a T node is the actual cost of the S-T route.
        </li>
        <li>
          When T is popped from the frontier queue, its cost is the smallest out of all remaining
          estimated total costs, which are in turn less than or equal to their best possible S-T
          paths. As such, its path is optimal.
        </li>
        <li>
          The reason behind the massive speed up can be understood as such:
          <ul>
            <li>
              When h(X) provides perfect information, this algorithm will always lead us
              straight through the best neighbor each time.
            </li>
            <li>
              When h(X) provides us with no information (returns 0 each time), this algorithm will
              simply degenerate into uniform-cost search.
            </li>
            <li>
              When h(X) is somewhere in between, it provides us with speed up from uniform-search
              by prioritizing the frontier nodes that are most likely to contibute to the final solution.
            </li>
          </ul>
        </li>
      </ul>
      <PageAnchor anchorKey="visualization" label="Visualization" />
      <Title order={2}>
        Visualization
      </Title>
      { graph }
      <Center>
        <Select
            label="Algorithm type:"
            value={algorithmType}
            // @ts-expect-error value can only be in allowed value ranges
            onChange={setAlgorithmType}
            // @ts-expect-error mantine doesn't accept constant arrays
            data={ALLOWED_ALGORITHM_TYPES}
          />
      </Center>
      <Center mt="md">
        <Group>
          <ActionIcon
            variant="outline"
            onClick={() => {
              setCurrentStep((prev) => (Math.max(0, prev - 1)));
            }}
          >
            <IconArrowLeft />
          </ActionIcon>
          <Text>
            Step: {currentStep}
          </Text>
          <ActionIcon
            variant="outline"
            onClick={() => {
              setCurrentStep((prev) => (Math.min(searchHistory.length - 1, prev + 1)));
            }}
          >
            <IconArrowRight />
          </ActionIcon>
        </Group>
      </Center>
      <Group grow align="start">
        <Box>
          <Text fw={1000}>
            Operations
          </Text>
          <ul>
            {currentStep < searchHistory.length && searchHistory[currentStep].frontierMessages.map(
              (message) => (<li key={message}>{message}</li>)
            )}
          </ul>
          <Divider />
          <ul>
            {currentStep < searchHistory.length && searchHistory[currentStep].bestPathMessages.map(
              (message) => (<li key={message}>{message}</li>)
            )}
          </ul>
        </Box>
        <Box>
          <Text fw={1000}>
            Frontier
          </Text>
            {currentStep < searchHistory.length && (
              <Text>size: {searchHistory[currentStep].frontierSize}</Text>
            )}
          <ol>
            {currentStep < searchHistory.length && searchHistory[currentStep].frontierTopElems.map(
              ({ vertex, path, value, cost, nodeId }) => (
                <li key={nodeId}>
                  <Text>{vertex}: path={path}, value={value.toFixed(2)}, cost={cost}</Text>
                </li>
              )
            )}
            <li>...</li>
          </ol>
        </Box>
        <Box>
          <Text fw={1000}>
            Current best path
          </Text>
          <ul>
            {currentStep < searchHistory.length && Object.entries(searchHistory[currentStep].bestPath).map(
              ([vertex, { path, cost }]) => (
                <li key={vertex}>
                  <Text>{vertex}: path={path}, cost={cost}</Text>
                </li>
              )
            )}
          </ul>
        </Box>
      </Group>
    <PageAnchor anchorKey="conclusion" label="Conclusion" />
    <Title order={2}>
      Conclusion
    </Title>
    <p>
      While state-of-the-art real-life applications like navigations has turned to
      more advanced methods using preprocessed maps, the A* search algorithm nonetheless
      remains an important pillar in artificial intelligence methods. The concept of
      optimizing traditional algorithms with heuristics can be further extended into
      many other techniques like minimax search, simplex search, and dynamic programming,
      and will provide useful efficiency increases in many applications.
    </p>
    </Content>
  );
}

export default AStar;
