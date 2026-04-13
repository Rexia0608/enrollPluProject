import pg from "pg";

const db = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "testAccounts",
  password: "123",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default db;
