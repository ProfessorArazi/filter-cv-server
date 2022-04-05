const nodemailer = require("nodemailer");

const mailSender = (client, files) => {
  const filterEmail = process.env.EMAIL;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: filterEmail,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: filterEmail,
    to: client,
    subject: "",
    html: "",
    attachments: files.map((path) => {
      let obj = {};
      obj.filename = path.slice(7);
      obj.path = path;
      return obj;
    }),
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    }
  });
};

module.exports = mailSender;
