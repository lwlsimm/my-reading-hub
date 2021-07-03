const userRouter = require('express').Router();
require('dotenv').config();
const { sendMail } = require('../email/email')

module.exports = userRouter;

userRouter.get('/', async (req, res, next) => {
  try {
    const result = await sendMail('From Lee','<a href="http://localhost:5500/api/i">This is from Lee</a>');
    res.send(result)
  } catch (err) {
    console.error(err.message)
  }
})