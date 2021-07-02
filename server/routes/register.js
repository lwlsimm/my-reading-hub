const registerRouter = require('express').Router();
const { checkUserExists, hashPassword, updateDatabase } = require('../functions/registrationFunctions');
const { sendMail } = require('../email/email');
module.exports = registerRouter;



registerRouter.post('/', checkUserExists, hashPassword, updateDatabase, async(req, res) => {
  try {
    const verificationLink = `http://localhost:3000/verify/${req.body.email}/${req.body.code}`;
    const registrationEmailPlainText = `Please enable HTML for the link to verify your 'My Book Hub' account.  Alternatively, paste the following link into your browser: ${verificationLink}`;
    const registrationHTML = `<h2>Thank you for joining My Reading Hub</h2><p>To complete the registraion process, please just click on the link below:</p><p><a href=${verificationLink}>Click here to verify your email</a></p>`
    const result = await sendMail(req.body.email, registrationEmailPlainText, registrationHTML);
    console.log(await result['accepted'][0])
    if(await result['accepted'][0] === req.body.email) {
      console.log('Success')
      res.send()
      return
    } else {
      console.log('Failure')
      throw new Error
    }
  } catch (error) {
    console.error(error.message)
    res.status(401).send(error.message);
  }
})