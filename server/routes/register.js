const registerRouter = require('express').Router();
const { checkUserExists, hashPassword, updateDatabase } = require('../functions/registrationFunctions');
const { sendMail } = require('../email/email');
const { registrationEmailPlainText, registrationHTML } = require('../email/emailText')
module.exports = registerRouter;


registerRouter.post('/', checkUserExists, hashPassword, updateDatabase, async(req, res) => {
  try {
    const verificationLink = `http://localhost:5500/api/verify/${req.body.email}/${req.body.code}`;
    const result = await sendMail(req.body.email, registrationEmailPlainText(verificationLink), registrationHTML(verificationLink));
    if(await result['accepted'][0] === req.body.email) {
      res.send()
    } else {
      throw new Error
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
})