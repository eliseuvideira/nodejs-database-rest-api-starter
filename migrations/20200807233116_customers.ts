import * as Knex from 'knex';
import { serial, text, timestamps } from '../database/utils/columns';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('customers', (table) => {
    serial(table, 'customer_id').primary();
    text(table, 'name');
    timestamps(table, knex);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('customers');
}
