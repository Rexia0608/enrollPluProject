import nodemailer from "nodemailer";
import config from "../config/auth.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

export const sendEmail = async (data) => {
  try {
    const mailOptions = {
      from: config.email.user,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error;
  }
};
