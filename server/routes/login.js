const loginRouter = require('express').Router();
module.exports = loginRouter;
const { checkPassword, generateAccessToken, getBookDetails } = require('../functions/loginFunctions');



loginRouter.post('/' , checkPassword, getBookDetails, async(req, res) => {
  try {
    const { email, id, verified, plan_package } = req.body;
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