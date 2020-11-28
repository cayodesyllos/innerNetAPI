const AWS = require("aws-sdk");
// Load credentials and set region from JSON file
AWS.config = new AWS.Config({
  accessKeyId: process.env.PROCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: "us-east-2",
});

var rekognition = new AWS.Rekognition();
const bucketName = "rekognition2121";

execute = async (photo_key, document_key) => {
  var params = {
    SimilarityThreshold: 90,
    SourceImage: {
      S3Object: {
        Bucket: bucketName,
        Name: document_key,
      },
    },
    TargetImage: {
      S3Object: {
        Bucket: bucketName,
        Name: photo_key,
      },
    },
  };

  const face_match = await new Promise((resolve, reject) => {
    rekognition.compareFaces(params, function (err, data) {
      if (err) resolve(false);
      else {
        if (data.FaceMatches.length > 0) {
          resolve(true);
        }
      }
      resolve(false);
    });
  });

  return face_match;
};

module.exports = { execute };
