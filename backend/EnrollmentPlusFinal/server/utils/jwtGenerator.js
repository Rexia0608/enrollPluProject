import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import config from "../config/auth.js";

dotenv.config();

const jwtGenerator = (user) => {
  const payload = user;
  return jwt.sign(payload, config.auth.jwtSecret, { expiresIn: "1h" });
};

export default jwtGenerator;
