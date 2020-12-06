"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class LikeSchema extends Schema {
  up() {
    this.create("likes", (table) => {
      table.increments();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onUpdate("cascade")
        .onDelete("cascade");
      table
        .integer("post_id")
        .unsigned()
        .references("id")
        .inTable("posts")
        .onUpdate("cascade")
        .onDelete("cascade");
      table.timestamps();
    });
  }

  down() {
    this.drop("likes");
  }
}

module.exports = LikeSchema;
