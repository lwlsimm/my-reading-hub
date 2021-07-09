const userRouter = require('express').Router();
require('dotenv').config();
const { sendMail } = require('../email/email');
const { authenticateToken } = require('../functions/authenticateFunctions');
const { addNewPlan,updatePlan } = require('../functions/planFunctions')

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
      if(addPlanToDB) {
        res.send(addPlanToDB);
      }
      throw new Error
    } else {
      throw new Error
    }
  } catch (err) {
    res.status(403).send()
  }
})

userRouter.post('/updatePlan', authenticateToken, async(req, res) => {
  try {
    if(req.body.authenticated) {
      const {plan_id, scheme} = req.body;
      const serverQuery = await updatePlan(plan_id, scheme);
      if(await serverQuery) {
        res.status(200).send(true);
      }
    } else {
      throw new Error
    }
  } catch (err) {
    res.status(403).send()
  }
})