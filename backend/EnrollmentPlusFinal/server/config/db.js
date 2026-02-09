import pg from "pg";
import dotenv from "dotenv";
import config from "../config/auth.js";
dotenv.config();

const db = new pg.Client({
  user: config.db.user,
  host: config.db.host,
  database: config.db.name,
  password: config.db.password,
  port: config.db.port,
});

db.connect();

export default db;
