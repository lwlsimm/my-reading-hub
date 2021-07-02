const userRouter = require('express').Router();
const pool = require('../database/db');
require('dotenv').config();
const nodemailer = require("nodemailer");
const { google } = require('googleapis');
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