require("dotenv").config();

const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production"; //checks if we are in production in our environment file

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}?sslmode=true`;

const pool = new Pool({
  connectionString: isProduction
    ? process.env.DB_DATABASE_URL
    : connectionString, //if we are in production use url of remote database else use localhost
});

module.exports = { pool };
