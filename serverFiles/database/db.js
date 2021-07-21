const Pool = require('pg').Pool;
require('dotenv').config();

const devConfig = {
  user: process.env.SERVER_USER,
  password: process.env.SERVER_PASSWORD,
  host: process.env.SERVER_HOST,
  port: process.env.SERVER_PORT,
  database: process.env.SERVER_DATABASE
};
 
const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
}

const pool = new Pool( process.env.NODE_ENV === 'production' ?  proConfig : devConfig );


module.exports = pool;