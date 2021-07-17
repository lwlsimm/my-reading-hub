const loginRouter = require('express').Router();
module.exports = loginRouter;
const { checkPassword, generateAccessToken, getBookDetails, resetPassword, checkIfResetPasswordAttempt, updatePasswordAfterReset  } = require('../functions/loginFunctions');
const { hashPassword } = require('../functions/registrationFunctions');



loginRouter.post('/' , checkPassword, getBookDetails, async(req, res) => {
  try {
    const { email, id, verified, plan_package } = req.body;
    if(id === null) {
      //now check if this is a reset password request
      const reset_email  = req.body.email;
      const reset_passwordEntered  = req.body.password;
      const isResetAttempt = await checkIfResetPasswordAttempt(reset_email, reset_passwordEntered);
      if(isResetAttempt) {
        res.status(200).send({is_verified: 'reset', code: req.body.password}) 
      }
    }
    if(!id) {
      res.status(401).send();
    }
    if(!verified) {
      res.status(200).send({is_verified: false, email: email});
    }
    const tokenData = await generateAccessToken(id);
    const { token } = await tokenData;
    res.status(200).send({is_verified: true, id: id, token: token, plan_package: plan_package}) 
  } catch (error) {
    res.status(401).send();
  }
});

loginRouter.post('/reset_pw', async(req, res)=> {
  try {
    const passwordSent = await resetPassword(req.body.email);
    res.send();
  } catch (error) {
    res.status(401).send();
  }
});

loginRouter.post('/update_reset_pw', hashPassword , async(req, res)=> {
  try {
    const {email, code} = req.body;
    const password = req.body.hashedPassword
    const passwordChanged = updatePasswordAfterReset(email, password, code);
    if(passwordChanged) {
      res.send(true);
    }
  } catch (error) {
    console.log('update_reset_pw error:', error.message)
    res.status(401).send();
  }
})