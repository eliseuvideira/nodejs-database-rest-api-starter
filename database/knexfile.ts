import dotenv from 'dotenv-safe';
import { resolve } from 'path';

dotenv.config({
  path: resolve(__dirname, '..', '.env'),
  example: resolve(__dirname, '..', '.env.example'),
});

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite3',
    },
    useNullAsDefault: true,
    migrations: {
      directory: 'migrations',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: 'migrations',
    },
  },
};
