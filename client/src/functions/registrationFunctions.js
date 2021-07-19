import axios from 'axios';
import { keys } from '../assets/keys/keys';
const { validateEmail } = require('./commonFunctions')


async function registerUser (e) {
  const email = e.target.email.value;
  const password = e.target.password.value;
  const reenteredPassword = e.target.reenteredpassword.value;
  const isEmailValid = validateEmail(email);
  let errorMessage = ''
  if(!isEmailValid) errorMessage = 'The email address enetered does not appear to be valid!';
  if(password !== reenteredPassword) errorMessage = errorMessage + "Your passwords do not match!";
  if(errorMessage.length > 1) throw Error(errorMessage);
  try {
    const data = await axios({
      method: 'POST',
      url: keys.REGISTER_PATH,
      data: {
        email: email,
        password: password
      }
    });
    return data;
  } catch (err) {
    errorMessage = "There was problem registering.  Perhaps you already have an account? If not, please contact us via the About button above.";
    throw Error(errorMessage);
  }
}

async function resendVerificationEmail (email) {
  const path = keys.REVERIFY_PATH + email;
  axios({
    method: 'POST',
    url: path,
    data: {
      email: email
    }
  })
}


export { registerUser, resendVerificationEmail }