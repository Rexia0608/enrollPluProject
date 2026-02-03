import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPEmail = async (to, code) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"EnrollPlus" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your EnrollPlus Verification Code",
    html: `<h2>Email Verification</h2><h1>${code}</h1><p>Expires in 5 minutes</p>`,
  });
};
