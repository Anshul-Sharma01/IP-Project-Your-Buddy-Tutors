const nodemailer = require("nodemailer");

async function sendMail(email, otp) {
  let testAccount = await nodemailer.createTestAccount();

  // connect with the smtp
  let transporter = await nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "david94@ethereal.email",
      pass: "Y8dsbvjY4z2TzDmY1v",
    },
  });

  let info = await transporter.sendMail({
    from: '"Udta Birde touter👻" <krish86303@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Udta Birde Touter", // Subject line
    text: `otp from udta birde ${otp}`, // plain text body
  });

  console.log("Message sent: %s", info.messageId);
}

// let em = "anshulsharma2926@gmail.com";
// let o = 1234;
// sendMail(em, o);
module.exports = sendMail;
