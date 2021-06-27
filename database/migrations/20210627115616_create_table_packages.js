const { Knex } = require("knex");
const { setUpdatedAt } = require("../functions/setUpdatedAt");

/**
 * @param {Knex} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable("packages", (table) => {
    table.text("name").notNullable().primary();
    table.text("version").notNullable();
    table.text("license").notNullable();
    table.text("description").notNullable();
    table.text("homepage").notNullable();
    table.text("repository").notNullable();
    table.integer("downloads").notNullable();
    table.dateTime("created_at").notNullable();
    table.dateTime("updated_at").notNullable();
  });

  await setUpdatedAt(knex, "packages");

  await knex.schema.raw(`
    alter table packages
    add constraint ck_packages_downloads check (downloads >= 0);
  `);
};

/**
 * @param {Knex} knex
 */
exports.down = async (knex) => {
  await knex.schema.dropTable("packages");
};
