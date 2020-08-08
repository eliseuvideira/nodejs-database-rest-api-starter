import dotenv from 'dotenv-safe';
dotenv.config();

import { database } from '../../src/utils/database';

beforeAll(async () => {
  await database.migrate.latest();
});

afterAll(async () => {
  await database.migrate.rollback({}, true);
  await database.destroy();
});
