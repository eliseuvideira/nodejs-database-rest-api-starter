import dotenv from '@ev-fns/dotenv';

dotenv({}, dotenv.startup);

import server from '@ev-fns/server';
import app from './app';
import { database } from './functions/database';

const PORT = +(process.env.PORT || 0) || 3000;

server(
  app,
  PORT,
  async () => {
    await database.raw('SELECT 1 AS server_status');
    await database.migrate.latest();
  },
  () => {
    console.info(`listening at http://localhost:${PORT}`);
  },
).catch((err) => {
  console.error(err);
  process.exit(1);
});
