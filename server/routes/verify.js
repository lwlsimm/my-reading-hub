const verifyRouter = require('express').Router();
const pool = require('../database/db');
const {resendVerificationEmail} = require('../functions/verificationFunctions')
module.exports = verifyRouter;

const { isValidationStillValid } = require('../functions/verificationFunctions')

const successRoute = 'http://localhost:3000/verificationsuccess';
const failRoute = 'http://localhost:3000/verificationfail';

verifyRouter.post('/resend/:email', async(req, res)=> {
  try {
    console.log(req.body.email)
    resendVerificationEmail(req.body.email)
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(401)
  } 
});

verifyRouter.get('/:email/:code', async(req, res)=> {
  try {
    const { email, code } = req.params;
    const isVerificationValid = await isValidationStillValid(email,code);
    if(await isVerificationValid) {
      res.redirect(successRoute).send()
    } else {
      resendVerificationEmail(email)
      res.redirect(failRoute)
    }
  } catch (error) {
    resendVerificationEmail(email)
    res.redirect(failRoute)
  }
});




