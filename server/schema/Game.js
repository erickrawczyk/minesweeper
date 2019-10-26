import { gql } from 'apollo-server-express';

import db from '../lib/db';

const MAX_DIMENSION = 25;
const MIN_DIMENSION = 3;

const isValid = value => {
  return value >= MIN_DIMENSION && value <= MAX_DIMENSION;
};

// generate board from squares
const buildBoard = squares => {
  const board = [];
  squares.forEach(square => {
    const { x, y } = square;
    if (typeof board[y] === 'undefined') board[y] = [];
    if (typeof board[y][x] === 'undefined') board[y][x] = square;
  });

  return board;
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
    async board({ id, board }) {
      // bypass query if provided
      if (board && board.length) return board;

      // load squares
      console.log('loading squares');

      const squares = await db('squares')
        .select('*')
        .where({
          game_id: id,
        });

      return buildBoard(squares);
    },
  },
  Query: {
    games() {
      return db('games').select();
    },
  },
  Mutation: {
    async createGame(_, { width, height }) {
      // Validate input
      if (![height, width].every(isValid)) {
        throw new Error(
          `Height and width must be between ${MIN_DIMENSION} and ${MAX_DIMENSION} squares`,
        );
      }

      // Create game from width and height
      const [game] = await db('games')
        .insert({ width, height })
        .returning('*');

      // Build objects for board squares
      let squares = [];
      for (let y = 0; y <= height; y++) {
        for (let x = 0; x <= width; x++) {
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
