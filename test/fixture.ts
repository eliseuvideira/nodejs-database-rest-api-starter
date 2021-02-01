import dotenv from '@ev-fns/dotenv';

dotenv();

import { database } from '../src/utils/database';
import knex from 'knex';
import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD } from '../src/utils/constants';

const createDatabase = async (dbName: string) => {
  const postgres = knex({
    client: 'pg',
    connection: {
      host: DB_HOST,
      port: DB_PORT || 5432,
      user: DB_USER,
      password: DB_PASSWORD,
    },
  });

  await postgres.raw(`CREATE DATABASE ${dbName}`);

  await postgres.destroy();
};

const dropDatabase = async (dbName: string) => {
  const postgres = knex({
    client: 'pg',
    connection: {
      host: DB_HOST,
      port: DB_PORT || 5432,
      user: DB_USER,
      password: DB_PASSWORD,
    },
  });

  await postgres.raw(`DROP DATABASE ${dbName}`);

  await postgres.destroy();
};

const dbName = database.client.config.connection.database;

beforeAll(async () => {
  await createDatabase(dbName);
  await database.migrate.latest();
});

afterAll(async () => {
  await database.migrate.rollback({}, true);
  await database.destroy();
  await dropDatabase(dbName);
});
