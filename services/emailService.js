const nodemailer = require("nodemailer");
const config = require("../config/env");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.emailUser,
    pass: config.emailPass,
  },
});

exports.sendEmail = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: config.emailUser,
    to,
    subject,
    text,
    html,
  };
  return await transporter.sendMail(mailOptions);
};
