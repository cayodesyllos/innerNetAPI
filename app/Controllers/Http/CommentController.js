"use strict";
const Comment = use("App/Models/Comment");

class CommentController {
  async store({ request, response, auth }) {
    try {
      const content = request.input("content");
      const post_id = request.input("post_id");

      const comment = await Comment.create({
        content: content,
        post_id: post_id,
        user_id: auth.user.id,
      });

      return comment;
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = CommentController;
