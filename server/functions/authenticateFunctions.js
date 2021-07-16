require('dotenv').config();
const pool = require('../database/db');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) {
      throw new Error
    }
    jwt.verify(token, 
      process.env.ACCESS_TOKEN_SECRET,
      (err, user) => {
        if(err) {
          throw new Error;
        }
        req.body.user = user;
        req.body.authenticated = true;
        next()
      }
    )
  } catch (error) {
    req.body.authenticted = false;
    next()
  }
}

async function authenticateEmail(req, res, next) {
  try {
    const {email} = req.body;
    const id = req.body.user.id;
    const serverQuery = await pool.query("SELECT email FROM users WHERE id = $1",[id]);
    const emailFomServer = await serverQuery.rows[0]['email'];
    if(await emailFomServer === email) {
      req.body.email_authenticated = true;
    } else {
      req.body.email_authenticated = false;
    }
    next()
  } catch (error) {
    req.body.email_authenticated = false;
    next()
  }
}

module.exports = { authenticateToken, authenticateEmail }