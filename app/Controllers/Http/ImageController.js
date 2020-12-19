"use strict";

const Drive = use("Drive");
const crypto = require("crypto");

const Image = use("App/Models/Image");

class ImageController {
  async store({ request, response, params }) {
    const user_id = parseInt(params.id);
    var key = "";
    const verification_image = await Image.query()
      .where("user_id", user_id)
      .where("verification", true)
      .fetch();

    await request.multipart
      .file("image", {}, async (file) => {
        try {
          key = crypto.randomBytes(10).toString("hex");
          await Image.create({ user_id: user_id, key: key });

          await Drive.put(key, file.stream, {
            ContentType: "image/png",
            ACL: "public-read",
          });
        } catch (error) {
          return response.status(400).send({
            error: { message: error.message },
          });
        }
      })
      .process();
    const resp = {
      key: key,
      key_verification: verification_image
        ? verification_image.toJSON()[0].key
        : null,
    };
    return response.status(200).send(resp);
  }
}

module.exports = ImageController;
