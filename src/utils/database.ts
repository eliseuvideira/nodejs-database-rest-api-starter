import knex from "knex";
import path from "path";

const MIN_POOL = 2;
const MAX_POOL = 20;

export const database = knex({
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  pool: {
    min: MIN_POOL,
    max: MAX_POOL,
  },
  migrations: {
    directory: path.join(__dirname, "..", "..", "database", "migrations"),
  },
});
