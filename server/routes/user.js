const userRouter = require('express').Router();
require('dotenv').config();
const { sendMail } = require('../email/email');
const { authenticateToken } = require('../functions/authenticateFunctions');
const { addNewPlan } = require('../functions/planFunctions')

module.exports = userRouter;

userRouter.post('/session_validation', authenticateToken, async (req, res) => {
  try {
    if(req.body.authenticated) {
      res.send('Success');
    } else {
      throw new Error
    }
  } catch (err) {
    res.sendStatus(403);
  }
})

userRouter.post('/addPlan', authenticateToken, async(req, res) => {
  try {
    if(req.body.authenticated) {
      const id = req.body.user.id;
      const addPlanToDB = await addNewPlan(id, req.body.plan)
      res.send( req.body.plan);
    } else {
      throw new Error
    }
  } catch (err) {
    res.send(403)
  }
})