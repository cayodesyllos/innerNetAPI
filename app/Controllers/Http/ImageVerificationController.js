"use strict";

const Drive = use("Drive");
const crypto = require("crypto");

const Image = use("App/Models/Image");

class ImageVerificationController {
  async store({ request, response, params }) {
    const user_id = parseInt(params.id);
    var key = "";

    await request.multipart
      .file("image", {}, async (file) => {
        try {
          key = crypto.randomBytes(10).toString("hex");

          await Image.create({
            user_id: user_id,
            key: key,
            verification: true,
          });

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

    return response.status(200).send({
      key: key,
    });
  }
}

module.exports = ImageVerificationController;
