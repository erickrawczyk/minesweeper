import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Game {
    id: ID!
    createdAt: String!
    modifiedAt: String!
    endedAt: String
    width: Int!
    height: Int!
    board: [[Square]]!
  }

  extend type Query {
    games: [Game]
  }

  extend type Mutation {
    createGame(width: Int!, height: Int!): Game
  }
`;

const game = {
  id: 'foo',
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  endedAt: new Date().toISOString(),
  width: 3,
  height: 2,
};

const createSquare = attrs => ({
  id: Math.floor(Math.random() * 1000),
  gameId: 'foo',
  selected: false,
  hasBomb: Math.random() >= 0.5,
  ...attrs,
});

export const resolvers = {
  Game: {
    board: () => {
      const board = [];
      // replace with select * from squares where gameId = $1
      const squares = [
        createSquare({ x: 0, y: 0 }),
        createSquare({ x: 1, y: 0 }),
        createSquare({ x: 2, y: 0 }),
        createSquare({ x: 0, y: 1 }),
        createSquare({ x: 1, y: 1 }),
        createSquare({ x: 2, y: 1 }),
      ];

      squares.forEach(square => {
        const { x, y } = square;
        if (typeof board[y] === 'undefined') board[y] = [];
        if (typeof board[y][x] === 'undefined') board[y][x] = square;
      });

      return board;
    },
  },
  Query: {
    games: () => [game],
  },
  Mutation: {
    createGame: (_, { height, width }) => {
      return {
        ...game,
        height,
        width,
      };
    },
  },
};
