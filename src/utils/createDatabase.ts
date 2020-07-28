import Knex from 'knex';

interface Props {
  host: string;
  user: string;
  password: string;
  database: string;
  poolMin?: number;
  poolMax?: number;
}

export const createDatabase = ({
  host,
  user,
  password,
  database,
  poolMin,
  poolMax,
}: Props) =>
  Knex({
    client: 'pg',
    connection: {
      host,
      user,
      password,
      database,
    },
    pool: {
      min: poolMin || 2,
      max: poolMax || 20,
    },
  });
