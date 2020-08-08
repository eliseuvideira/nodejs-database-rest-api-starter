import Knex from 'knex';

export const text = (table: Knex.CreateTableBuilder, name: string) =>
  table.text(name);

export const serial = (table: Knex.CreateTableBuilder, name: string) =>
  table.increments(name);

export const timestamps = (table: Knex.CreateTableBuilder, database: Knex) => {
  table.dateTime('created_at').notNullable().defaultTo(database.fn.now());
  table.dateTime('updated_at').notNullable().defaultTo(database.fn.now());
};
