import { createDatabase } from './createDatabase';

export const database = createDatabase({
  host: process.env.POSTGRES_HOST || '',
  user: process.env.POSTGRES_USER || '',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || '',
  poolMin: +(process.env.POSTGRES_POOL_MIN || '2'),
  poolMax: +(process.env.POSTGRES_POOL_MAX || '20'),
});
