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
    move(_, { gameId, x, y }) {
      /*
      // update selected square
      update squares set selected = true where gameId = $1, x = $2, y = $3 returning *

      // lose if bomb
      if bomb
        update games set completedAt = now(), result = 'LOST' where id = $1 returning *
      // otherwise check for win condition where every non-bomb square has been selected
      else
        select * from squares where gameId = $1 and hasBomb = false
        if squares.every(selected) 
          update games set completedAt = now(), result = 'WON' where id = $1 returning *
        else
          select * from games where id = $1
      */
      // return {
      //   id: Math.floor(Math.random() * 1000),
      //   gameId,
      //   selected: true,
      //   hasBomb: Math.random() >= 0.5,
      //   x,
      //   y,
      // };
      return {
        id: 'foo',
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        width: 3,
        height: 2,
      };
    },
  },
};
