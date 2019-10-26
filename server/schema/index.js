import { gql, makeExecutableSchema } from 'apollo-server-express';

import { typeDefs as Game, resolvers as GameResolvers } from './Game';
import { typeDefs as Square, resolvers as SquareResolvers } from './Square';

const Root = gql`
  type Query
`;

const typeDefs = [Root, Game, Square];

const resolvers = [GameResolvers, SquareResolvers];

const AppSchema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger: {
    log: e => console.log(e.originalError || e.stack),
  },
});

export default AppSchema;
