import knex from 'knex';
import { join } from 'path';
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_DATABASE,
  NODE_ENV,
} from './constants';

const MIN_POOL = 2;
const MAX_POOL = 20;

export const database = knex({
  client: 'pg',
  connection: {
    host: DB_HOST,
    port: DB_PORT || 5432,
    user: DB_USER,
    password: DB_PASSWORD,
    database: `${DB_DATABASE}${NODE_ENV === 'test' ? '_test' : ''}`,
  },
  pool: {
    min: MIN_POOL,
    max: MAX_POOL,
  },
  migrations: {
    directory: join(__dirname, '..', '..', 'database', 'migrations'),
  },
});
