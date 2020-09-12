const Knex = require('knex');

/**
 * @param {Knex} knex
 */
exports.up = async function (knex) {
  await knex.schema.raw(`
    CREATE FUNCTION set_updated_at() 
    RETURNS TRIGGER AS $$
      if (TG_OP == "UPDATE") {
        NEW[TG_ARGV[0] \\? TG_ARGV[0] : 'updated_at'] = new Date();
      }
      return NEW;
    $$ LANGUAGE "plv8";
  `);
};

/**
 * @param {Knex} knex
 */
exports.down = async function (knex) {
  await knex.schema.raw(`DROP FUNCTION set_updated_at;`);
};
