"use strict";
const User = use("App/Models/User");
const Event = use("Event");
const crypto = require("crypto");

class UserController {
  async store({ request, response }) {
    const data = request.only(["username", "email", "password"]);
    try {
      const token = crypto.randomBytes(10).toString("hex");
      data.token = token;
      const user = await User.create(data);
      Event.fire("user::signUp", data);
      return user;
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
    return;
  }
}

module.exports = UserController;
