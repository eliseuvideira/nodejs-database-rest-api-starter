export const NODE_ENV = process.env.NODE_ENV || 'development';

type DatabaseClient = 'pg' | 'sqlite3';

export const DATABASE_CLIENT: DatabaseClient = ['test', 'development'].includes(
  NODE_ENV,
)
  ? 'sqlite3'
  : 'pg';
