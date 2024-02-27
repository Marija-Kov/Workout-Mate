const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  user: process.env.SB_USER,
  password: process.env.SB_PASSWORD,
  host: process.env.SB_HOST,
  database: process.env.SB_DATABASE,
});

client.connect();

module.exports = client;