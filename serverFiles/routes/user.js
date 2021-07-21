const userRouter = require('express').Router();
require('dotenv').config();
const { sendMail } = require('../email/email');
const { authenticateToken, authenticateEmail } = require('../functions/authenticateFunctions');
const { addNewPlan,updatePlan, deletePlan } = require('../functions/planFunctions');
const { contactFormToAdminPlanText,contactFormToAdminHTML, contactFormConfirmationPlanText, contactFormConfirmationHTML } = require('../email/emailText');
const { changePassword, changeEmail, deletePlansForId, deleteAccount, } = require('../functions/settingsFunctions');
const { checkCurrentPasswordUsingCustomerId   } = require('../functions/loginFunctions');
const { hashPassword } = require('../functions/registrationFunctions');

module.exports = userRouter;

userRouter.post('/session_validation', authenticateToken, async (req, res) => {
  try {
    if(req.body.authenticated) {
      res.send('Success');
    } else {
      throw new Error;
    }
  } catch (err) {
    res.status(403).send();
  }
})

userRouter.post('/deletePlan', authenticateToken, async(req, res) => {
  try {
    const isPlanDeletedFromServer = deletePlan(req.body.plan_id);
    if(await isPlanDeletedFromServer) res.send(true);
    throw Error;
  } catch(error) {
    res.status(403).send();
  }
})

userRouter.post('/addPlan', authenticateToken, async(req, res) => {
  try {
    if(req.body.authenticated) {
      const id = req.body.user.id;
      const addPlanToDB = await addNewPlan(id, req.body.plan)
      if(addPlanToDB) res.send(addPlanToDB);
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

userRouter.post('/contact', authenticateToken, authenticateEmail, async(req, res) => {
  try {
    const {email, message} = req.body;
    const plainTextToAdmin = contactFormToAdminPlanText(email, message);
    const htmlToAdmin = contactFormToAdminHTML(email, message);
    const emailToAdmin = await sendMail(process.env.ADMIN_EMAIL, plainTextToAdmin, htmlToAdmin);
    if(await emailToAdmin.accepted) {
      if(req.body.email_authenticated) {
        const confirmationEmailPlainText = contactFormConfirmationPlanText(message);
        const confirmationEmailHTML = contactFormConfirmationHTML(message);
        sendMail(email, confirmationEmailPlainText, confirmationEmailHTML);
      }
      res.send(true); 
    } else {
      res.send(false);
    }
  } catch (error) {
    console.log(error.message);
    res.send(false);
  }
});

userRouter.post('/changepw', authenticateToken, checkCurrentPasswordUsingCustomerId , hashPassword, async(req, res) => {
  try {
    const id = req.body.user.id;
    const { hashedPassword } = req.body;
    if(! req.body.pw_verified || !req.body.authenticated) throw new Error('auth failed');
    const isPasswordChanged = await changePassword(id, hashedPassword);
    if(await isPasswordChanged) {
      res.status(200).send(true);
    } else {
      throw new Error('unknown error');
    }
  } catch (error) {
    console.log(error.message);
    res.status(200).send(false);
  }
})

userRouter.post('/change_email', authenticateToken, checkCurrentPasswordUsingCustomerId, async(req, res) => {
  try {
    if(! req.body.pw_verified || !req.body.authenticated) {
      throw new Error('auth failed');
    };
    const id = req.body.user.id;
    const wasEmailChanged = await changeEmail(id, req.body.email); 
    if(await wasEmailChanged) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    res.send(false);
  }
});

userRouter.post('/delete_plans', authenticateToken, checkCurrentPasswordUsingCustomerId, async(req, res) => {
  try {
    if(! req.body.pw_verified || !req.body.authenticated) throw new Error('auth failed');
    const id = req.body.user.id;
    const werePlansDeleted = await deletePlansForId(id);
    if(await werePlansDeleted) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    res.send(false);
  }
})

userRouter.post('/delete_account', authenticateToken, checkCurrentPasswordUsingCustomerId, async(req, res) => {
  try {
    if(! req.body.pw_verified || !req.body.authenticated) throw new Error('auth failed');
    const id = req.body.user.id;
    const wasAccountDeleted = await deleteAccount(id);
    if(await wasAccountDeleted) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.log(error.message)
    res.send(false);
  }
});