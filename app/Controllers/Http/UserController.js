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

  async show({ request, response, auth }) {
    try {
      const user = await auth.getUser();
      const image = await user.image().fetch();
      const posts = await user.posts().orderBy("created_at", "desc").fetch();
      const posts_with_comments = await Promise.all(
        posts.rows.map(async (post) => {
          const comments = await post
            .comments()
            .orderBy("created_at", "desc")
            .fetch();
          const num_likes = await post.likes().getCount();
          const comments_with_users = await Promise.all(
            comments.rows.map(async (comment) => {
              const user_ = await User.findBy("id", comment.user_id);
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
            numLikes: parseInt(num_likes),
            created_at: post.created_at,
            comments: comments_with_users,
          };
        })
      );

      return {
        userAvatar: image.toJSON()[0].url,
        userName: user.username,
        posts: posts_with_comments,
      };
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = UserController;
