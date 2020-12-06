"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Image extends Model {
  static get computed() {
    return ["url"];
  }

  getUrl({ key }) {
    return process.env.S3_BASE_URL + key;
  }

  user() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Image;
