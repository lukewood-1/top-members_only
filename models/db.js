const { Pool } = require("pg");

const database = new Pool({
  connectionString: `${process.env.connectionString}${process.env.dbname}`
});

module.exports = database;