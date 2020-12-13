"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");
const moment = require("moment-timezone");

class Image extends Model {
  static get computed() {
    return ["url"];
  }

  static formatDates(field, value) {
    return moment(value).tz("America/Sao_Paulo").format();
  }

  getUrl({ key }) {
    return process.env.S3_BASE_URL + key;
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Image;
