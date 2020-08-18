const dotenv = require('dotenv-safe');
const { join } = require('path');

dotenv.config({
  path: join(__dirname, '..', '.env'),
  example: join(__dirname, '..', '.env.example'),
});

module.exports = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  pool: {
    min: 2,
    max: 20,
  },
};
