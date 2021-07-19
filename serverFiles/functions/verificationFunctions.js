const pool = require('../database/db');
const { sendMail } = require('../email/email');
const { registrationEmailPlainText, registrationHTML } = require('../email/emailText');
const { keys } = require('../keys/keys');

const isValidationStillValid = async (email, code) => {
  try {
    const timeNow = Date.now();
    const validationData = await pool.query('SELECT user_email, expiry FROM email_verification WHERE verification_code = $1', [code]);
    const { user_email, expiry } = await validationData.rows[0];
    if (user_email === email && timeNow < expiry) {
      const updatingValidation = await pool.query('UPDATE users SET verified = true WHERE email = $1 RETURNING id',[email]);
      if(await updatingValidation.rows[0]['id']) {
        return true;
      } else {
        return false
      }
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

async function resendVerificationEmail (email) {
  try {
    const expiry = Date.now() + (1000 * 60 * 60 *2);
    const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const addEmailVerificationToDb = await pool.query("UPDATE email_verification SET expiry = $1, verification_code = $2 WHERE user_email = $3 RETURNING id", [expiry, code, email]);
    const verificationId = await addEmailVerificationToDb.rows[0]  
    if(!verificationId) throw new Error;
    const verificationLink = `${keys.VERIFICATION_PATH}${email}/${code}`;
    sendMail(email, registrationEmailPlainText(verificationLink), registrationHTML(verificationLink));
    return
  } catch (error) {
    return new Error
  }
}


module.exports = { isValidationStillValid, resendVerificationEmail }