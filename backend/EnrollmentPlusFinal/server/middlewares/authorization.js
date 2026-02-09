import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import config from "../config/auth.js";

dotenv.config();

export default async (req, res, next) => {
  try {
    const jwtToken = req.header("token");

    if (!jwtToken) {
      return res.status(403).json({
        errors: [{ message: "User not authorized. No token provided." }],
      });
    }

    const payload = jwt.verify(jwtToken, config.auth.jwtSecret);
    req.user = payload;

    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    return res.status(403).json({
      errors: [{ message: "User not authorized. Invalid or expired token." }],
    });
  }
};
