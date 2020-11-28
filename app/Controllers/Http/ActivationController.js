"use strict";
const User = use("App/Models/User");
const Event = use("Event");
const crypto = require("crypto");

class ActivationController {
  async activate({ request, response, auth }) {
    const data = request.only(["token"]);
    try {
      if (auth.user.token === data.token) user.active = true;
      else throw new Error("Wrong token");
      return user;
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }

  async createActivation({ request, response, auth }) {
    try {
      const user = await User.findByOrFail("id", auth.user.id);
      user.token = crypto.randomBytes(10).toString("hex");
      user.save();

      const data = {
        email: user.email,
        token: user.token,
      };

      const user = await User.create(data);

      return;
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = ActivationController;
