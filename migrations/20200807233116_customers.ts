import * as Knex from 'knex';

const getClient = (database: Knex) => database.client.config.client;

const serial = (table: Knex.CreateTableBuilder, name: string) =>
  table.increments(name);

const string = (table: Knex.CreateTableBuilder, name: string, length = 255) =>
  table.string(name, length);

const text = (table: Knex.CreateTableBuilder, name: string) => table.text(name);

const timestamps = (knex: Knex, table: Knex.CreateTableBuilder) => {
  table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
  table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
};

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('customers', (table) => {
    serial(table, 'customer_id');
    getClient(knex) === 'pg' ? text(table, 'name') : string(table, 'name');
    timestamps(knex, table);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('customers');
}
