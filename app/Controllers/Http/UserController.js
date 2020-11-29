"use strict";
const User = use("App/Models/User");
const crypto = require("crypto");

class UserController {
  async store({ request, response }) {
    const data = request.only(["username", "email", "password"]);
    try {
      const token = crypto.randomBytes(4).toString("hex");
      data.token = token;
      const user = await User.create(data);

      return user;
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = UserController;
