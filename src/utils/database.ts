import { createDatabase } from './createDatabase';
import { config } from './database.config';
import { NODE_ENV } from './constants';

export const database = createDatabase(
  config[NODE_ENV as 'test' | 'development' | 'production'],
);
