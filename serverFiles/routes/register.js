const registerRouter = require('express').Router();
module.exports = registerRouter;

const { keys } = require('../keys/keys');
const { checkUserExists, hashPassword, updateDatabase } = require('../functions/registrationFunctions');
const { sendMail } = require('../email/email');
const { registrationEmailPlainText, registrationHTML } = require('../email/emailText')



registerRouter.post('/', checkUserExists, hashPassword, updateDatabase, async(req, res) => {
  try {
    const verificationLink = keys.VERIFICATION_PATH + req.body.email + '/' + req.body.code;
    const result = await sendMail(req.body.email, registrationEmailPlainText(verificationLink), registrationHTML(verificationLink));
    if(await result['accepted'][0] === req.body.email) {
      res.send({outcome: 'success'})
    } else {
      throw new Error
    }
  } catch (error) {
    res.status(401).send(error.message);
  }
})