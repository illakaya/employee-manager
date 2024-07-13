// import Pool from pg package
const { Pool } = require("pg");
// allows user to access data from .env file
require("dotenv").config();

// initialise an instance of pool
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
});

// export the instance of pool
module.exports = pool;
