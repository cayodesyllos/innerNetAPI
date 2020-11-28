var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
const Env = use("Env");
console.log(Env.get("EMAIL_FROM"), Env.get("EMAIL_PASS"));
const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: Env.get("EMAIL_FROM"),
      pass: Env.get("EMAIL_PASS"),
    },
  })
);

module.exports = { transporter };
