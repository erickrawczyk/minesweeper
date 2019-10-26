import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer, gql } from 'apollo-server-express';

import schema from './schema';
import db from './lib/db';

const { PORT = 8080 } = process.env;

const app = express();

const apolloServer = new ApolloServer({ schema, context: { db } });
apolloServer.applyMiddleware({ app });

app.listen({ port: PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`,
  ),
);
