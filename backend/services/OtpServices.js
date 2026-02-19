import db from "../config/db.js";
import authCodeGenerator from "../utils/AuthCodeGenerator.js";
import { checkIfTheUserExist } from "../models/usersAuthModel.js";
import { sendEmail } from "../utils/mailer.js";

const verifyingOtpModel = async ({ email, otp }) => {
  try {
    const users = await checkIfTheUserExist(email);

    if (!users.length) {
      return { error: "Email not found" };
    }

    const user = users[0];

    if (user.is_verified) {
      return { error: "Email already verified" };
    }

    // Check if OTP expired
    const now = new Date();
    if (user.otp_expires_at && now > user.otp_expires_at) {
      return { error: "OTP has expired" };
    }

    // Check OTP match
    if (user.email_otp !== otp) {
      return { error: "Incorrect OTP" };
    }

    // Mark as verified
    await db.query(
      `UPDATE credentials SET is_verified = true WHERE email = $1`,
      [email],
    );

    await sendEmail("verified_email", email, " ");

    return {
      message: `Email verified successfully! You may now login: ${email}`,
      email,
    };
  } catch (error) {
    console.error("Verifying OTP error:", error);
    throw error;
  }
};

const resendOtp = async ({ email }) => {
  try {
    const users = await checkIfTheUserExist(email);

    if (!users.length) {
      return { error: "Email not found" };
    }

    const user = users[0];
    const { otp, otpExpires } = await authCodeGenerator();

    if (user.is_verified) {
      return { error: "Email already verified" };
    }

    await db.query(
      `UPDATE credentials SET email_otp = $1, otp_expires_at = $2  WHERE email = $3`,
      [otp, otpExpires, email],
    );

    await sendEmail("sending_OTP", email, otp);

    return {
      message: `OTP sent successfully to ${email}`,
      email: email,
    };
  } catch (error) {
    console.error("Sending OTP error:", error);
    throw error;
  }
};

export { verifyingOtpModel, resendOtp };
