require('dotenv').config();
const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { passwordResetEmailPlainText, passwordResetEmailHTML  } = require('../email/emailText');
const { sendMail } = require('../email/email');

async function checkPassword (req, res, next) {
  try {
    const { email }  = req.body;
    const passwordEntered = req.body.password;
    const userData = await pool.query("SELECT id, verified FROM users WHERE email = $1", [email]);
    const { id, verified} = await userData.rows[0];
    const passwordData = await pool.query("SELECT hashed_pw FROM passwords WHERE customer_id = $1", [id]);
    const dbPassword = await passwordData.rows[0]['hashed_pw'];
    bcrypt.compare(passwordEntered, dbPassword, async function(err, result) {
      if(result) {
        req.body.id = id;
        req.body.verified = verified;
      } else {
        req.body.id = null;
      }
      next();
    });
  } catch (error) {
    req.body.id = null;
    next()
  }
}

async function checkIfResetPasswordAttempt (email, password) {
  try {
    const code = password.trim();
    const timeNow = Date.now();
    const pwCodeOnServer = await pool.query("SELECT * FROM password_reset WHERE verification_code = $1", [code]);
    const {expiry, user_email} = pwCodeOnServer.rows[0];
    if(timeNow < await expiry && user_email === email) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message)
    return false;    
  }
}

async function resetPassword (email) {
  try {
    const expiry = Date.now() + (1000 * 60 * 60 * 0.5);
    const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const userIdQuery = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    const userId = await userIdQuery.rows[0]['id'];
    const passwordIdQuery = await pool.query('SELECT id FROM passwords WHERE customer_id = $1', [await userId]);
    const password_id = await passwordIdQuery.rows[0]['id'];
    const passwordResentEntry = await pool.query('INSERT INTO password_reset (password_id, user_email, verification_code, expiry) VALUES ($1, $2, $3, $4) RETURNING id', [password_id, email, code, expiry]);
    const passwordResetId = await passwordResentEntry.rows[0]['id'];
    if(await passwordResetId) {
      const plainText = passwordResetEmailPlainText(code);
      const htmlText = passwordResetEmailHTML(code);
      const result = await sendMail(email, plainText, htmlText);
      if (await result['accepted'][0]) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    } 
  } catch (error) {
    console.log(error.message)
  }
}

async function updatePasswordAfterReset (email, password, code) {
  const code_from_client = code.trim();
  const timeNow = Date.now();
  const pwQuery = await pool.query("SELECT * FROM password_reset WHERE verification_code = $1", [code_from_client]);
  const {user_email, expiry} = pwQuery.rows[0];
  const idQuery = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
  const id = await idQuery.rows[0]['id']
  if(timeNow < expiry && user_email === email) {
    const serverQuery = await pool.query('UPDATE passwords SET hashed_pw = $1 WHERE customer_id = $2 RETURNING id', [password, id]);
    const result = await serverQuery.rows[0]['id']; 
    if(result) {
      return true;
    } else {
      return false;
    }
  }
}

async function checkCurrentPasswordUsingCustomerId (req, res, next) {
  try {
    const { id } = req.body.user;
    const { current_password } = req.body;
    const serverQuery = await pool.query("SELECT hashed_pw FROM passwords WHERE customer_id  = $1", [id]);
    const dbPassword = await serverQuery.rows[0]['hashed_pw'];
    bcrypt.compare(current_password, await dbPassword, async function(err, result) {
      if(await result) {
        req.body.pw_verified = true;
      } else {
        req.body.pw_verified = false;
      }
      next()
    });
  } catch (error) {
    req.body.pw_verified = false;
    next();
  }
}

async function getBookDetails (req, res, next) {
  try {
    const {id, verified} = req.body;
    if(!id || !verified) {
      next()
    }
    const serverQuery = await pool.query("SELECT * FROM reading_plans WHERE customer_id = $1", [id]);
    const data = await serverQuery.rows;
    req.body.plan_package = data;
    next()
  } catch(error) {
    next()
  }
}

const generateAccessToken = async(id) => {
  const oneWeekInMilliSecs = 60 * 60 * 24 * 7;
  return {token: jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET,  {expiresIn: oneWeekInMilliSecs})}
}


module.exports = { checkPassword, generateAccessToken, getBookDetails, checkCurrentPasswordUsingCustomerId, resetPassword, checkIfResetPasswordAttempt, updatePasswordAfterReset   }