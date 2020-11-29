"use strict";
const User = use("App/Models/User");
const Database = use("Database");

class SessionController {
  async authenticate({ request, response, auth }) {
    try {
      const { email, password } = request.all();
      await User.findByOrFail("email", email);

      const token = await auth.attempt(email, password);

      return token;
    } catch (error) {
      return await response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = SessionController;
