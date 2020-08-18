import Knex from 'knex';
import { join } from 'path';

const MIN_POOL = 2;
const MAX_POOL = 20;

export const createDatabase = ({
  client,
  connection,
}: Pick<Knex.Config, 'client' | 'connection'>) =>
  Knex({
    client,
    connection,
    pool: {
      min: MIN_POOL,
      max: MAX_POOL,
    },
    migrations: {
      directory: join(__dirname, '..', '..', 'database', 'migrations'),
    },
    log: {
      warn(message) {
        if (
          typeof message === 'string' &&
          message ===
            'FS-related option specified for migration configuration. This resets migrationSource to default FsMigrations'
        ) {
          return;
        }
        console.warn(message);
      },
    },
  });
