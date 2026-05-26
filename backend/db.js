const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: false , // Required for Azure PostgreSQL
});

// Create the contacts table if it doesn't exist
const initDB = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS contacts (
      id         SERIAL PRIMARY KEY,
      name       VARCHAR(100)  NOT NULL,
      email      VARCHAR(150)  NOT NULL UNIQUE,
      phone      VARCHAR(20)   NOT NULL,
      created_at TIMESTAMP     DEFAULT NOW()
    );
  `;
  await pool.query(query);
  console.log("Database initialised — contacts table ready.");
};

module.exports = { pool, initDB };
