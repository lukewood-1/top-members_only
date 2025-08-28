const { Pool } = require("pg");

const database = new Pool({
  connectionString: process.env.connectionString
});

module.exports = database;