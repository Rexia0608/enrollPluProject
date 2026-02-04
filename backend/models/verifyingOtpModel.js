import db from "../config/db.js";
import { checkIfTheUserExist } from "./usersModel.js";

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

    return {
      message: `Email verified successfully! You may now login: ${email}`,
      email,
    };
  } catch (error) {
    console.error("Verifying OTP error:", error);
    throw error;
  }
};

export { verifyingOtpModel };
