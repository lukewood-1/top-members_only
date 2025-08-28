const { Client } = require('pg');

async function main(){
  const query = `
  CREATE TABLE IF NOT EXISTS user_list (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(30) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_member BOOLEAN DEFAULT false,
  is_admin BOOLEAN,
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  handle VARCHAR(20) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS author (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname VARCHAR(30),
  lastname VARCHAR(30),
  user_id INT REFERENCES user_list(id)
  );

  CREATE TABLE IF NOT EXISTS post (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  content VARCHAR(255),
  title VARCHAR(30),
  timestamp TIMESTAMP DEFAULT LOCALTIMESTAMP(0),
  user_id INT REFERENCES user_list(id)
  );

  CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(255),
  password VARCHAR(255)
  );
  `;

  console.log('seeding...');

  const db = new Client({
    connectionString: process.env.connectionString
  });

  try {
    await db.connect();
    await db.query(query);
    await db.end();
    console.log('done.');
  } catch (e) {
    console.error(e);
  }
};

main();