"use strict";
const User = use("App/Models/User");
const Event = use("Event");
const crypto = require("crypto");

class ActivationController {
  async activate({ request, response, auth }) {
    const data = request.only(["token"]);
    const user = await User.findByOrFail("id", auth.user.id);
    try {
      if (auth.user.token === data.token) {
        user.active = true;
        await user.save();
      } else throw new Error("Wrong token");
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
      user.token = crypto.randomBytes(3).toString("hex");
      await user.save();

      const mail_data = {
        email: user.email,
        token: user.token,
      };
      Event.fire("user::signUp", mail_data);

      return;
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = ActivationController;
