"use strict";
const Like = use("App/Models/Like");

class LikeController {
  async store({ request, response, auth }) {
    try {
      const post_id = request.input("post_id");
      const user_id = auth.user.id;

      const already_liked = await Like.query()
        .where("post_id", post_id)
        .where("user_id", user_id)
        .getCount();

      if (already_liked > 0) throw new Error("already liked");

      const num_likes = await Like.query().where("post_id", post_id).getCount();
      const num_likes_refreshed = parseInt(num_likes) + 1;
      await Like.create({
        post_id: post_id,
        user_id: user_id,
      });

      return num_likes_refreshed;
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = LikeController;
