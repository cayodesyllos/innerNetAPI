"use strict";
const User = use("App/Models/User");
const Event = use("Event");
const crypto = require("crypto");
const Post = use("App/Models/Post");

class PostController {
  async store({ request, response, auth }) {
    try {
      const content = request.input("content");
      await Post.create({ content: content, user_id: auth.user.id });
      return;
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = PostController;
