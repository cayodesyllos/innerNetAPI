"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const moment = require("moment-timezone");

class Post extends Model {
  static formatDates(field, value) {
    return moment(value).tz("America/Sao_Paulo").format();
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
  comments() {
    return this.hasMany("App/Models/Comment");
  }
  likes() {
    return this.hasMany("App/Models/Like");
  }
}

module.exports = Post;
