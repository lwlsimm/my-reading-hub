const verifyRouter = require('express').Router();
const pool = require('../database/db');
module.exports = verifyRouter;

const { isValidationStillValid } = require('../functions/verificationFunctions')

verifyRouter.get('/:email/:code', async(req, res)=> {
  const { email, code } = req.params;
  const isVerificationValid = await isValidationStillValid(email,code);
  
})


