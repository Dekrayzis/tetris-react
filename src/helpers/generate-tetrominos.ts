import guid from 'guid';

import {
  red, orange, yellow, green, blue, indigo, violet,
} from '../style-variables';

type TetrominoType = 'I' | 'O' | 'T' | 'J' | 'L' | 'S' | 'Z';
type Offset = readonly [number, number];

interface TetrominoDefinition {
  type: TetrominoType;
  color: string;
  blockMapping: readonly Offset[];
}

export interface GeneratedTetromino {
  id: string;
  type: TetrominoType;
  color: string;
  position: null;
  blockIds: string[];
}

export interface GeneratedBlock {
  id: string;
  tetrominoId: string;
  color: string;
  localOffset: Offset;
}

export interface GenerateTetrominosOptions {
  num?: number;
}

const tetrominoDefinitions = {
  'I': {
    type: 'I',
    color: blue,
    blockMapping: [       //        |
      [-1, 0],            //        |
      [0, 0],             // ---[x][x][x][x]
      [1, 0],             //        |
      [2, 0],             //        |
    ],
  },
  'O': {
    type: 'O',
    color: yellow,
    blockMapping: [       //
      [0, -1],            //     |
      [1, 1],             //    [x][x]
      [1, 0],             // ---[x][x]
      [0, 0],             //
    ],
  },
  'T': {
    type: 'T',
    color: violet,
    blockMapping: [       //
      [-1, 0],            //     |
      [0, 0],             // [x][x][x]
      [0, 1],             //    [x]
      [1, 0],             //
    ],
  },
  'J': {
    type: 'J',
    color: indigo,
    blockMapping: [       //
      [-1, 0],            //     |
      [0, 0],             // [x][x][x]
      [1, 0],             //     | [x]
      [1, -1],            //
    ],
  },
  'L': {
    type: 'L',
    color: orange,
    blockMapping: [       //
      [-1, 1],            //     |
      [-1, 0],            // [x][x][x]
      [0, 0],             // [x] |
      [1, 0],             //
    ],
  },
  'S': {
    type: 'S',
    color: green,
    blockMapping: [       //
      [-1, 0],            //     |
      [0, 0],             // ---[x][x]
      [0, 1],             // [x][x]
      [1, 0],             //
    ],
  },
  'Z': {
    type: 'Z',
    color: red,
    blockMapping: [       //
      [-1, 0],            //     |
      [0, 0],             // [x][x]---
      [0, 1],             //    [x][x]
      [1, 0],             //
    ],
  },

} satisfies Record<TetrominoType, TetrominoDefinition>;

export default function generateTetrominos({ num = 100 }: GenerateTetrominosOptions = {}): {
  tetrominos: GeneratedTetromino[];
  blocks: GeneratedBlock[];
} {
  const tetrominos: GeneratedTetromino[] = [];
  const blocks: GeneratedBlock[] = [];

  const definitions = Object.values(tetrominoDefinitions);

  for (let i = 0; i < num; i += 1) {
    const sampled = definitions[Math.floor(Math.random() * definitions.length)];

    const tetrominoBase = {
      id: guid.raw(),
      position: null,
      ...sampled,
    };

    const { blockMapping, ...tetrominoWithoutMapping } = tetrominoBase;

    const tetrominoBlocks: GeneratedBlock[] = blockMapping.map((mapping) => ({
      id: guid.raw(),
      tetrominoId: tetrominoWithoutMapping.id,
      color: tetrominoWithoutMapping.color,
      localOffset: mapping,
    }));

    const tetromino: GeneratedTetromino = {
      ...tetrominoWithoutMapping,
      blockIds: tetrominoBlocks.map(({ id }) => id),
    };

    tetrominos.push(tetromino);
    blocks.push(...tetrominoBlocks);
  }

  return { tetrominos, blocks };
}
