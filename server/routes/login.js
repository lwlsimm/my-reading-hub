const loginRouter = require('express').Router();
module.exports = loginRouter;
const { checkPassword, generateAccessToken } = require('../functions/loginFunctions');



loginRouter.post('/' , checkPassword, async(req, res) => {
  try {
    const { email, id, verified } = req.body;
    if(!id) {
      res.status(401).send();
    }
    if(!verified) {
      res.status(200).send({is_verified: false, email: email});
    }
    const tokenData = await generateAccessToken(id);
    const {token, expiry} = await tokenData;
    res.status(200).send({is_verified: true, id: id, token: token}) 
  } 
    catch (error) {
  }
});