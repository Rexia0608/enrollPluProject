import db from "../config/db.js";

import jwtGenerator from "../utils/jwtGenerator.js";
import {
  registerCredentailsUserServices,
  userAuthEmailSenderServices,
  UsersAuthtokenServices,
  userAuthSetPasswordServices,
  checkIfTheUserExistServices,
  registerUserServices,
  verifyingOtpServices,
  validPasswordServices,
  resendOtpServices,
} from "../services/securityServices.js";

//++++++++++++++++++ finalized here +++++++++++++++++++//

const registerUserModel = async (passData) => {
  try {
    const isAlreadyRegistered = await checkIfTheUserExist(passData.email);

    if (isAlreadyRegistered.length > 0) {
      return {
        error:
          "Email is already in use. Please try to login using your credentials.",
      };
    }

    const { query, values } = await registerUserServices(passData);

    const userResult = await db.query(query, values);
    const userId = userResult.rows[0].id;

    const { credQuery, credValues } = await registerCredentailsUserServices(
      userId,
      passData,
    );

    const data = await db.query(credQuery, credValues);
    await firstUserAdminSetRoleModel(userId);

    return data.rows[0].email;
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

const userAuthSetPasswordModel = async (id, passData) => {
  try {
    const { query, values } = await userAuthSetPasswordServices(id, passData);

    const updatedData = await db.query(query, values);

    await userAuthEmailSenderServices(
      "password-set",
      updatedData.rows[0].email,
      updatedData.rows[0].email,
    );

    return updatedData.rows[0].email;
  } catch (error) {
    console.error("userAuthPasswordModel error:", error);
    throw error;
  }
};

const userAuthPasswordModel = async (passData) => {
  try {
    const { query, value, isTokenValid } =
      await UsersAuthtokenServices(passData);
    const data = await db.query(query, value);
    const otpExpires = new Date(data.rows[0].otp_expires_at);
    const now = new Date();
    return isTokenValid && otpExpires > now ? true : false;
  } catch (error) {
    console.error("userAuthPasswordModel error:", error);
    throw error;
  }
};

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

    const { query, value } = await verifyingOtpServices(email);
    await db.query(query, value);
    await userAuthEmailSenderServices("verified_email", email, " ");

    return email;
  } catch (error) {
    console.error("Verifying OTP error:", error);
    throw error;
  }
};

const resendOtpModel = async ({ email }) => {
  try {
    const users = await checkIfTheUserExist(email);

    if (!users.length) {
      return { error: "Email not found" };
    }

    const user = users[0];

    const { query, values } = await resendOtpServices(user.email);

    await db.query(query, values);

    return user.email;
  } catch (error) {
    console.error("Sending OTP error:", error);
    throw error;
  }
};

const loginUserModel = async (data) => {
  try {
    const user = await checkIfTheUserExist(data.email);

    if (!user || user.length === 0) {
      return { error: "Invalid credentials" };
    }

    if (!user[0].is_verified) {
      return { error: "Email is not yet verified.", user: user[0].email };
    }

    const { validPassword } = await validPasswordServices(
      data.password,
      user[0].password,
    );

    if (!validPassword) {
      return { error: "Invalid credentials" };
    }

    const token = jwtGenerator(user[0].user_id);

    // ✅ Return user object + token
    return {
      user: {
        id: user[0].id,
        name: user[0].first_name + " " + user[0].last_name,
        birthdate: user[0].birthdate,
        gender: user[0].gender,
        email: user[0].email,
        mobile: user[0].mobile_number,
        auth: user[0].is_verified,
        role: user[0].role,
      },
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

//++++++++++++++++++ finalized here +++++++++++++++++++//

//++++++++++++++++++ helper here +++++++++++++++++++//
const checkIfTheUserExist = async (email) => {
  const { query, value } = checkIfTheUserExistServices(email);
  const data = await db.query(query, value);
  return data.rows;
};

const firstUserAdminSetRoleModel = async (userId) => {
  try {
    const result = await db.query(`SELECT COUNT(*) AS total_users FROM users;`);

    const totalUsers = parseInt(result.rows[0].total_users, 10);

    const role = totalUsers === 1 ? "admin" : "student";

    await db.query(`UPDATE users SET role = $1 WHERE id = $2`, [role, userId]);
    await db.query(`UPDATE users SET status = $1 WHERE id = $2`, [
      true,
      userId,
    ]);
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
};

//++++++++++++++++++ helper here +++++++++++++++++++//

export {
  resendOtpModel,
  verifyingOtpModel,
  userAuthSetPasswordModel,
  registerUserModel,
  checkIfTheUserExist,
  loginUserModel,
  userAuthPasswordModel,
};
