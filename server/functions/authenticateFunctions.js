require('dotenv').config();
const pool = require('../database/db');
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
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
    res.sendStatus(403);
  }
}

module.exports = { authenticateToken }