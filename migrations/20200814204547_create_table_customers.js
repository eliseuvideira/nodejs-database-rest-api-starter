const Knex = require('knex');

/**
 *
 * @param {Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('customers', (table) => {
    table.increments('customer_id').primary();
    table.text('name').notNullable();
    table.dateTime('created_at').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updated_at').notNullable().defaultTo(knex.fn.now());
  });
};

/**
 *
 * @param {Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.dropTable('customers');
};
