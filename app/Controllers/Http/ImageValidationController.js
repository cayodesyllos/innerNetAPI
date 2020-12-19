"use strict";

const Rekognition = require("../../Services/Rekognition");
const User = use("App/Models/User");
const Drive = use("Drive");
const Event = use("Event");
const crypto = require("crypto");

class ImageValidationController {
  async store({ request, response, params }) {
    const user_id = params.id;
    try {
      const data = request.only(["user_pic", "user_doc", "add"]);
      const user = await User.findByOrFail("id", user_id);

      const match_face = await Rekognition.execute(
        data.user_pic,
        data.user_doc
      );

      if (!match_face) {
        const images = await user.image().orderBy("created_at", "desc").fetch();

        if (data.add === true) {
          await Drive.delete(images.rows[0].key);
          await images.rows[0].delete();
        } else {
          await Promise.all(
            images.rows.map(async (img) => {
              await Drive.delete(img.key);
              await img.delete();
            })
          );
        }

        throw new Error("Faces do not match!");
      }

      if (!data.add) {
        const token = crypto.randomBytes(3).toString("hex");
        user.token = token;
        await user.save();

        const mail_data = {
          email: user.email,
          token: token,
        };

        Event.fire("user::signUp", mail_data);
      } else {
        const images = await user.image().orderBy("created_at", "desc").fetch();
        await Drive.delete(images.rows[1].key);
        await images.rows[1].delete();
      }

      return response.status(200).send({
        message: "Faces match",
        uri: process.env.S3_BASE_URL + data.user_pic,
      });
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = ImageValidationController;
