const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('../database/db');


//Check if the user already exists
async function checkUserExists (req, res, next) {
  try {
    const serverQuery = await pool.query("INSERT INTO users (email) VALUES($1) RETURNING id", [req.body.email]);
    const userId = await serverQuery.rows[0];
    req.body.userId = userId['id'];
    next();
  } catch (error) {
    res.status(401).send(error.message);
  }
}

async function hashPassword (req, res, next) {
  try {
    const password = req.body.password;
    const saltRounds = 10;
    bcrypt.genSalt(saltRounds, async function(err, salt) {
      bcrypt.hash(password, salt, async function(err, hash) {
          req.body.hashedPassword = await hash
          await next()
        });
    });
  } catch (error) {
    console.log('hashPassword error:', error.message)
    res.status(401).send(error.message);
  }
}

async function updateDatabase (req, res, next) {
  try {
    const { userId, hashedPassword, email } = req.body;
    const hashed_pw = String(hashedPassword)
    const addPasswordToDb = await pool.query("INSERT INTO passwords (customer_id, hashed_pw) VALUES ($1, $2) RETURNING id", [userId, hashed_pw]);
    const passwordId = await addPasswordToDb.rows[0]['id'];
    if(!passwordId) {
      throw new Error;
    }
    const expiry = Date.now() + (1000 * 60 * 60 *2);
    const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const addEmailVerificationToDb = await pool.query("INSERT INTO email_verification (user_email, verification_code, expiry) VALUES($1, $2, $3) RETURNING id", [email, code , expiry]);
    const verificationId = await addEmailVerificationToDb.rows[0]
    if(!verificationId) throw new Error;
    req.body.code = code;
    next();
  } catch (error) {
    console.error(error.message)
    res.status(401).send(error.message);
  }
}

module.exports = { checkUserExists, hashPassword, updateDatabase }