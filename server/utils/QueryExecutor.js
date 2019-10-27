// This file allows running queries with a mocked data store
// pass the mocked return value into the constructor and
// you can make assertions against db or the results
const createDbMock = require('./createDbMock');
const { ApolloServer } = require('apollo-server-express');
const { createTestClient } = require('apollo-server-testing');

const esmImport = require('esm')(module);
const { typeDefs, resolvers } = esmImport('../schema');

class QueryExecutor {
  constructor(returnValue) {
    const db = createDbMock(returnValue);
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({ db }),
    });
    const { query } = createTestClient(server);
    return { executeQuery: query, db };
  }
}

module.exports = QueryExecutor;
