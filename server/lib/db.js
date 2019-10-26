import knex from 'knex';

const { DB_URL, DB_USERNAME, DB_PASSWORD } = process.env;

const db = knex({
  client: 'pg',
  connection: {
    host: DB_URL,
    user: DB_USERNAME,
    password: DB_PASSWORD,
    database: 'minesweeper',
  },
});

export default db;
