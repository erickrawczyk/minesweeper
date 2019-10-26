import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Square {
    id: ID
    gameId: String
    selected: Boolean
    hasBomb: Boolean
    x: Int
    y: Int
  }
`;

export const resolvers = {};
