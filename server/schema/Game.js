import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  enum GameResult {
    WON
    LOST
  }

  type Game {
    id: ID!
    createdAt: String!
    modifiedAt: String!
    completedAt: String
    width: Int!
    height: Int!
    board: [[Square]]!
    result: GameResult
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
  completedAt: new Date().toISOString(),
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
      /*
      game = insert into games (height, width) values (height, width) returning *
      let squares = []
      for (const y in height)
        for (const x in width)
          squares.push({
            gameId: game.id,
            x,
            y,
          })
      insert into squares (*) values(...squares)
      */
      return {
        ...game,
        height,
        width,
      };
    },
  },
};
