const Knex = require('knex');

/**
 * @param {Knex} knex
 * @param {string} table
 * @param {string} field
 */
exports.setUpdatedAt = async (
  knex,
  table,
  field = 'updated_at',
  trigger = `${table}_set_updated_at`,
) => {
  await knex.raw(`
    CREATE TRIGGER ${trigger}
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE set_updated_at('${field}');
  `);
};

/**
 * @param {Knex} knex
 * @param {string} table
 * @param {string} field
 */
exports.dropUpdatedAt = async (
  knex,
  table,
  trigger = `${table}_set_updated_at`,
) => {
  await knex.raw(`DROP TRIGGER ${trigger} ON ${table};`);
};
