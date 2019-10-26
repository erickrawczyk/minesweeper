import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Square {
    id: ID!
    gameId: String!
    selected: Boolean!
    hasBomb: Boolean!
    x: Int!
    y: Int!
  }

  extend type Mutation {
    move(gameId: ID!, x: Int!, y: Int!): Square
  }
`;

export const resolvers = {
  Mutation: {
    move: (_, { gameId, x, y }) => {
      return {
        id: Math.floor(Math.random() * 1000),
        gameId,
        selected: true,
        hasBomb: Math.random() >= 0.5,
        x,
        y,
      };
    },
  },
};
