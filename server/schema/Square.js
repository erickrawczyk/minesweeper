import { gql, UserInputError } from 'apollo-server-express';

export const typeDefs = gql`
  type Square {
    id: ID!
    gameId: String!
    selected: Boolean!
    hasBomb: Boolean!
    x: Int!
    y: Int!
    adjacentBombs: Int
  }

  extend type Mutation {
    move(gameId: ID!, x: Int!, y: Int!): Game
  }
`;

export const resolvers = {
  Square: {
    gameId({ game_id }) {
      return game_id;
    },
    hasBomb({ has_bomb }) {
      return has_bomb;
    },
  },
  Mutation: {
    async move(_, { gameId, x, y }, { db }) {
      // Load square to make sure it exists and it's not already selected
      const initialSquare = await db('squares')
        .select()
        .where({ game_id: gameId, x, y })
        .first();

      if (!initialSquare) {
        throw new UserInputError('Square not found');
      }

      if (initialSquare.selected) {
        throw new UserInputError('This square is already selected');
      }

      // Update selected square
      const [square] = await db('squares')
        .update({ selected: true })
        .where({ game_id: gameId, x, y })
        .returning('*');

      // Check for explosions
      if (square.has_bomb) {
        const [game] = await db('games')
          .update({
            completed_at: new Date().toISOString(),
            result: 'LOST',
          })
          .where({ id: gameId })
          .returning('*');

        return game;
      }

      // Load squares to check for win condition
      const squares = await db('squares')
        .select()
        .where({
          game_id: gameId,
          has_bomb: false,
        });

      // set game as won
      if (squares.every(s => s.selected)) {
        const [game] = await db('games')
          .update({
            completed_at: new Date().toISOString(),
            result: 'WON',
          })
          .where({ id: gameId })
          .returning('*');

        return game;
      }

      // If game isn't over, load game and return
      return await db('games')
        .select()
        .where({ id: gameId })
        .first();
    },
  },
};
