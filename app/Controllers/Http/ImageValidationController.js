"use strict";

const Rekognition = require("../../Services/Rekognition");
const User = use("App/Models/User");
const Drive = use("Drive");

class ImageValidationController {
  async store({ request, response, params }) {
    const user_id = params.id;
    try {
      const data = request.only(["user_pic", "user_doc"]);

      const match_face = await Rekognition.execute(
        data.user_pic,
        data.user_doc
      );

      if (!match_face) {
        const user = await User.findByOrFail("id", user_id);
        const images = await user.images().fetch();

        await Promise.all(
          images.rows.map(async (img) => {
            await Drive.delete(img.key);
            await img.delete();
          })
        );

        throw new Error("Faces do not match!");
      }

      return response.status(200).send({ message: "Faces match" });
    } catch (error) {
      return response.status(400).send({
        error: { message: error.message },
      });
    }
  }
}

module.exports = ImageValidationController;