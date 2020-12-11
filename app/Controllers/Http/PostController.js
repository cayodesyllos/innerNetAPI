"use strict";
const User = use("App/Models/User");
const Event = use("Event");
const crypto = require("crypto");
const Post = use("App/Models/Post");

class PostController {
  async store({ request, response, auth }) {
    try {
      const content = request.input("content");
      const post = await Post.create({
        content: content,
        user_id: auth.user.id,
      });
      return post;
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }

  async index({ request, response, auth }) {
    try {
      const user_id = auth.user.id;

      const posts = await Post.query()
        .where("user_id", "!=", user_id)
        .orderBy("created_at", "desc")
        .fetch();
      const posts_with_comments = await Promise.all(
        posts.rows.map(async (post) => {
          const comments = await post
            .comments()
            .orderBy("created_at", "desc")
            .fetch();
          const num_likes = await post.likes().getCount();
          const user = await post.user().fetch();
          const image = await user.image().where("verification", false).fetch();
          const comments_with_users = await Promise.all(
            comments.rows.map(async (comment) => {
              const user_ = await comment.user().fetch();
              const image_ = await user_
                .image()
                .where("verification", false)
                .fetch();

              return {
                userAvatar: image_.toJSON()[0].url,
                userName: user_.username,
                content: comment.content,
                created_at: comment.created_at,
              };
            })
          );
          return {
            id: post.id,
            content: post.content,
            userAvatar: image.toJSON()[0].url,
            userName: user.username,
            numLikes: parseInt(num_likes),
            created_at: post.created_at,
            comments: comments_with_users,
          };
        })
      );

      return posts_with_comments;
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = PostController;
