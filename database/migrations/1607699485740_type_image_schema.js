"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TypeImageSchema extends Schema {
  up() {
    this.table("images", (table) => {
      table.boolean("verification").defaultTo(false);
    });
  }

  down() {
    this.table("images", (table) => {
      table.dropColumn("verification");
    });
  }
}

module.exports = TypeImageSchema;
