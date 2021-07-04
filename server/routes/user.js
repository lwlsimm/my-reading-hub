const userRouter = require('express').Router();
require('dotenv').config();
const { sendMail } = require('../email/email');
const { authenticateToken } = require('../functions/authenticateFunctions')

module.exports = userRouter;

userRouter.post('/session_validation', authenticateToken, async (req, res) => {
  try {
    if(req.body.authenticated) {
      res.send('Success');
    } else {
      throw new Error
    }
  } catch (err) {
    res.sendStatus(403);
  }
})