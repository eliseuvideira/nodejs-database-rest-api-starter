import Knex from 'knex';

export const database = Knex({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  pool: {
    min: +(process.env.POSTGRES_POOL_MIN || '2'),
    max: +(process.env.POSTGRES_POOL_MAX || '20'),
  },
});
