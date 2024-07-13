// import Pool from pg package
const { Pool } = require("pg");
// allows user to access data from .env file
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
});

module.exports = pool;
