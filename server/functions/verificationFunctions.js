const pool = require('../database/db');

const isValidationStillValid = async (email, code) => {
  const timeNow = Date.now();
  const validationData = await pool.query('SELECT user_email, expiry FROM email_verification WHERE verification_code = $1', [code]);
  const { user_email, expiry } = await validationData.rows[0];
  if (user_email === email && timeNow < expiry) {
    const updatingValidation = await pool.query('UPDATE users SET verified = true WHERE email = $1',[email])
    return true;
  }
  return false;
};


module.exports = { isValidationStillValid }