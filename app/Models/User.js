"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

const Hash = use("Hash");

class User extends Model {
  static get hidden() {
    return ["password"];
  }

  image() {
    return this.hasMany("App/Models/Image");
  }

  posts() {
    return this.hasMany("App/Models/Post");
  }

  static boot() {
    super.boot();
    this.addHook("beforeSave", async (userInstance) => {
      if (userInstance.dirty.username) {
        const username = userInstance.username.split(" ");
        const usernameParts = username.filter((elem) => {
          if (elem !== "") return elem;
        });

        var usernameFinal = "";
        for (let i = 0; i < usernameParts.length; i++) {
          const elem = usernameParts[i];
          usernameFinal += elem;
          if (i !== usernameParts.length - 1) usernameFinal += " ";
        }

        userInstance.username = usernameFinal;
      }

      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password);
      }
    });
    this.addHook("beforeCreate", async (userInstance) => {
      if (userInstance.dirty.email) {
        userInstance.email = userInstance.email.toLowerCase();
      }
    });
  }
}

module.exports = User;
