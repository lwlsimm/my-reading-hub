const Pool = require('pg').Pool;

const pool = new Pool({
  user: "postgres",
  password: "2151",
  host: "localhost",
  port: 5432,
  database: 'my-reading-hub'
});

module.exports = pool;