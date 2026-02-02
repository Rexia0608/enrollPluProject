import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password
  },
});

export const sendOTPEmail = async (to, code) => {
  await transporter.sendMail({
    from: `"EnrollPlus" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your EnrollPlus Verification Code",
    html: `
      <h2>Email Verification</h2>
      <p>Your verification code is:</p>
      <h1>${code}</h1>
      <p>This code expires in 5 minutes.</p>
    `,
  });
};
