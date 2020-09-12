const Knex = require('knex');

/**
 * @param {Knex} knex
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE EXTENSION plv8;`);
};

/**
 * @param {Knex} knex
 */
exports.down = async function (knex) {
  await knex.raw(`DROP EXTENSION plv8;`);
};
