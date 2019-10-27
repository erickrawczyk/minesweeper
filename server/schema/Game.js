import { gql, UserInputError } from 'apollo-server-express';

import buildBoard from '../lib/buildBoard';

const MAX_LENGTH = 50;
const MIN_LENGTH = 2;

const isValid = value => {
  return value >= MIN_LENGTH && value <= MAX_LENGTH;
};

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
    height: Int!
    width: Int!
    result: GameResult
    board: [[Square]]!
  }

  extend type Query {
    games: [Game]
  }

  extend type Mutation {
    createGame(width: Int!, height: Int!): Game
  }
`;

export const resolvers = {
  Game: {
    createdAt({ created_at }) {
      return new Date(created_at).toISOString();
    },
    modifiedAt({ modified_at }) {
      return new Date(modified_at).toISOString();
    },
    completedAt({ completed_at }) {
      return completed_at ? new Date(completed_at).toISOString() : null;
    },
    async board({ id, board }, args, { db }) {
      // bypass query if provided
      if (board && board.length) return board;

      // load squares
      const squares = await db('squares')
        .select('*')
        .where({
          game_id: id,
        });

      return buildBoard(squares);
    },
  },
  Query: {
    games(_, args, { db }) {
      return db('games').select();
    },
  },
  Mutation: {
    async createGame(_, { width, height }, { db }) {
      // Validate input
      if (![height, width].every(isValid)) {
        throw new UserInputError(
          `Height and width must be between ${MIN_LENGTH} and ${MAX_LENGTH} squares`,
        );
      }

      // Create game from width and height
      const [game] = await db('games')
        .insert({ width, height })
        .returning('*');

      // Build objects for board squares
      let squares = [];
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          squares.push({
            game_id: game.id,
            // Original minesweeper had 12%-17% bomb probability
            has_bomb: Math.random() < 0.15,
            x,
            y,
          });
        }
      }

      // Create squares
      const loadedSquares = await db('squares')
        .insert(squares)
        .returning('*');

      return {
        ...game,
        board: buildBoard(loadedSquares),
      };
    },
  },
};
