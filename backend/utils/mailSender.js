import nodemailer from "nodemailer";

const mailSender = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    post: process.env.SMTP_PORT,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  let res = await transporter.sendMail({
    from: process.env.SMTP_MAIL,
    to: options.email,
    subject: options.subject,
    html: "" + options.OTP + "",
  });

  console.log("Message sent: %s", res.messageId);
};

export default mailSender;
