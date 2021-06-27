const { dotenv } = require("@ev-fns/dotenv");
const { join } = require("path");

dotenv({
  path: join(__dirname, "..", ".env"),
  example: join(__dirname, "..", ".env.example"),
});

module.exports = {
  client: "pg",
  connection: {
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
  migrations: {
    stub: "stub.js",
  },
};
