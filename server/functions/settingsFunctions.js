const pool = require('../database/db');
const { sendMail } = require('../email/email');
const { keys } = require('../keys/keys');
const { registrationEmailPlainText, registrationHTML } = require('../email/emailText')


async function changePassword (customer_id, new_password) {
  try {
    const serverQuery = await pool.query('UPDATE passwords SET hashed_pw = $1 WHERE customer_id = $2 RETURNING id', [new_password, customer_id]);
    const result = await serverQuery.rows[0]['id']; 
    if(await result) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

async function changeEmail (customer_id, new_email) {
  try {
    const expiry = Date.now() + (1000 * 60 * 60 *2);
    const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const verificationLink = keys.VERIFICATION_PATH + new_email + '/' + code;
    const getOldEmail = await pool.query('SELECT email FROM users WHERE id = $1',[customer_id]);
    const old_email = await getOldEmail.rows[0]['email'];
    const deleteVerification = await pool.query('DELETE FROM email_verification WHERE user_email = $1 RETURNING id',[old_email]);
    if(await deleteVerification.rows[0]['id']) {
      const serverQuery = await pool.query('UPDATE users SET email = $1, verified = FALSE WHERE id = $2 RETURNING id', [new_email, customer_id]);
      if(await serverQuery.rows[0]['id']) {
        const addEmailVerificationToDb = await pool.query("INSERT INTO email_verification (user_email, verification_code, expiry) VALUES($1, $2, $3) RETURNING id", [new_email, code , expiry]);
        const verificationId = await addEmailVerificationToDb.rows[0]['id'];
        if(await verificationId) {
          const result = await sendMail(new_email, registrationEmailPlainText(verificationLink), registrationHTML(verificationLink));
          if(await result['accepted'][0] === new_email) {
            return true;
          } else {return false}
        } else {return false}
      } else {return false}
    } else {return false}
  } catch (error) {
    console.log(error.message)
    return false
  }
}

async function deletePlansForId (id) {
  try {
    const areThereAnyPlans = await pool.query("SELECT * FROM reading_plans WHERE customer_id = $1", [id])
    if(await areThereAnyPlans.rows[0]) {
      const deletionOfPlans = await pool.query("DELETE FROM reading_plans WHERE customer_id = $1 RETURNING customer_id", [id]);
      if(await deletionOfPlans.rows[0]) {
        return true;
      } else {
        return false;
      }
    } else {
      return true
    }
  } catch (error) {
    return false;
  }
}

async function deleteAccount (id) {
  try {
    console.log('start')
    const emailData = await pool.query("SELECT email FROM users WHERE id = $1", [id]);
    const email = emailData.rows[0]['email'];
    console.log(id)
    const planDelete = await pool.query("DELETE FROM reading_plans WHERE customer_id = $1", [id]);
    const passwordDelete = await pool.query("DELETE FROM passwords WHERE customer_id = $1", [id]);
    const verificationDelete = await pool.query("DELETE FROM email_verification WHERE user_email = $1", [email]);
    const userDelete = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id", [id]);
    if(userDelete) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message)
    return false;
  }
}


module.exports = { changePassword, changeEmail, deletePlansForId, deleteAccount,  }