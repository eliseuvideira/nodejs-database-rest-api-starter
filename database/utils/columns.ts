import Knex from 'knex';
import { DATABASE_CLIENT } from './constants';

export const string = (
  table: Knex.CreateTableBuilder,
  name: string,
  length?: number | undefined,
) =>
  DATABASE_CLIENT === 'pg' && !length
    ? table.text(name)
    : table.string(name, length);

export const serial = (table: Knex.CreateTableBuilder, name: string) =>
  table.increments(name);

export const timestamps = (table: Knex.CreateTableBuilder, database: Knex) => {
  table.dateTime('created_at').notNullable().defaultTo(database.fn.now());
  table.dateTime('updated_at').notNullable().defaultTo(database.fn.now());
};
