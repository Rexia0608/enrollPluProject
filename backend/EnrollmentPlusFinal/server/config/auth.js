import dotenv from "dotenv";

dotenv.config();

const config = {
  app: {
    port: process.env.PORT,
    env: process.env.NODE_ENV,
  },
  db: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
    saltRound: process.env.SALT_ROUNDS,
    pepper: process.env.PEPPER_SECRET,
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  maintenance: {
    defaultMessage: "System under maintenance",
  },
};

export default config;
