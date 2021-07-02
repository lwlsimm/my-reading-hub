import axios from 'axios';
import { keys } from '../assets/keys/keys';

const validateEmail = (email) => {
 if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
    return true
  }
  return false
}

const registerUser = async (e) => {
  const email = e.target.email.value;
  const password = e.target.password.value;
  const reenteredPassword = e.target.reenteredpassword.value;
  const isEmailValid = validateEmail(email);
  let errorMessage = ''
  if(!isEmailValid) {
    errorMessage = 'The email address enetered does not appear to be valid! '
  } 
  if(password !== reenteredPassword) {
    errorMessage = errorMessage + "Your passwords do not match!"
  }
  if(errorMessage.length > 1) {
    throw Error(errorMessage)
  }
  try {
    const data = await axios({
      method: 'POST',
      url: keys.REGISTER_PATH,
      data: {
        email: email,
        password: password
      }
    })
  } catch (err) {
    errorMessage = "There was problem registering.  Perhaps you already have an account? If not, please contact us via the About button above."
    throw Error(errorMessage)
  }
}


export default registerUser