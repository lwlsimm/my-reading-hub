require('dotenv').config();
const pool = require('../database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        null
      }
      next();
    });
  } catch (error) {
    req.body.id = null;
    next()
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


module.exports = { checkPassword, generateAccessToken, getBookDetails }