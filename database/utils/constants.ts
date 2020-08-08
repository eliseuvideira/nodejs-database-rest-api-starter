export const NODE_ENV = process.env.NODE_ENV || 'development';

type DatabaseClient = 'pg' | 'sqlite3';

export const DATABASE_CLIENT: DatabaseClient =
  NODE_ENV === 'test' ? 'sqlite3' : 'pg';
