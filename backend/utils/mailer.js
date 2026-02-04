import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendOTPEmail = async (type, to, code) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  switch (type) {
    case "sending_OTP":
      await transporter.sendMail({
        from: `"EnrollPlus" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your EnrollPlus Verification Code",
        html: sendOtp(code),
      });
      break;

    case "verified_email":
      await transporter.sendMail({
        from: `"EnrollPlus" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your account has successfully verified",
        html: verifiedMsg(to),
      });
      break;

    default:
      break;
  }
};

const verifiedMsg = (data) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; line-height: 1.6;">
    <h2 style="color: #2563eb;">Welcome to EnrollPlus 🎓</h2>

    <p>Hi there,</p>

    <p>
      Great news! Your email address ${data} has been <b>successfully verified</b>.
      Your account is now fully activated and ready to use.
    </p>

    <p>
      You can now log in, complete your enrollment, and stay updated with
      important announcements and notifications.
    </p>

    <div style="margin: 24px 0;">
      <a
        href="http://localhost:5173/login"
        style="
          background-color: #2563eb;
          color: #ffffff;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Go to Login
      </a>
    </div>

    <hr />

    <p style="font-size: 12px; color: #6b7280;">
      If you did not create this account, please contact our support team
      immediately.
    </p>

    <p style="font-size: 12px; color: #6b7280;">
      © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
    </p>
  </div>
`;
};

const sendOtp = (code) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; line-height: 1.6;">
      <h2 style="color: #2563eb;">Verify Your Email Address 🔐</h2>

      <p>Hi,</p>

      <p>
        To complete your registration with <b>EnrollPlus</b>,
        please use the verification code below:
      </p>

      <div style="margin: 24px 0; text-align: center;">
        <span
          style="
            font-size: 32px;
            letter-spacing: 8px;
            font-weight: bold;
            color: #111827;
          "
        >
          ${code}
        </span>
      </div>

      <p>
        This code will expire in <b>5 minutes</b>.
        Please do not share this code with anyone.
      </p>

      <hr />

      <p style="font-size: 12px; color: #6b7280;">
        If you did not request this verification, you can safely ignore this email.
      </p>

      <p style="font-size: 12px; color: #6b7280;">
        © ${new Date().getFullYear()} EnrollPlus. All rights reserved.
      </p>
    </div>
  `;
};
