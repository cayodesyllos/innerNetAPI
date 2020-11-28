const mail = require("../utils/mail");

const User = (exports = module.exports = {});

User.signUp = async (data) => {
  var mailOptions = {
    from: "Inner Net",
    to: data.email,
    subject: "Confirm your email",
    text: `Use the following code in the app: ${data.token}`,
  };

  mail.transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
