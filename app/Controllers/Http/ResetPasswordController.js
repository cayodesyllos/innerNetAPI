"use strict";
const User = use("App/Models/User");
const Event = use("Event");
const crypto = require("crypto");
const Hash = use("Hash");

class ResetPasswordController {
  async refresh({ request, response }) {
    try {
      const data = request.only(["token", "password"]);
      const user = await User.findByOrFail("token", data.token);
      const new_password = data.password;
      console.log(new_password);
      user.password = await Hash.make(new_password);
      user.token = null;
      await user.save();
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }

  async sendResetEmail({ request, response }) {
    try {
      const data = request.only(["email"]);
      const user = await User.findByOrFail("email", data.email);
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

module.exports = ResetPasswordController;
