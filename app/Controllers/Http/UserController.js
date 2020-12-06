"use strict";
const User = use("App/Models/User");

class UserController {
  async store({ request, response }) {
    const data = request.only(["username", "email", "password"]);
    try {
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
