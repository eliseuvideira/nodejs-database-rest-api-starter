const Knex = require('knex');

/**
 * @param {Knex} knex
 */
exports.up = async function (knex) {
  await knex.raw(`CREATE EXTENSION "uuid-ossp";`);
};

/**
 * @param {Knex} knex
 */
exports.down = async function (knex) {
  await knex.raw(`DROP EXTENSION "uuid-ossp";`);
};
