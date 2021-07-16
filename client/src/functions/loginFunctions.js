import axios from 'axios';
import { keys } from '../assets/keys/keys';

const { validateEmail } = require('./commonFunctions')

const loginUser = async (email, password) => {
  try {
    const isEmailValid = validateEmail(email);
    if(!isEmailValid) {
      throw new Error('This does not appear to be a valid email')
    }
    const data = await axios({
      method: 'POST',
      url: keys.LOGIN_PATH,
      data: {
        email: email,
        password: password
      }
    })
    return data
  } catch (error) {
    throw new Error('There was a problem logging in.  Please check the email and password provided.')
  }
}

const authenticateSession = async(token) => {
  const data = await axios({
    method: 'post',
    headers: {
      authorization: `Bearer ${token}`
    },
    url: keys.AUTHENTICATE_PATH,
  });
  if(await data.data === 'Success') {
    return true
  } else {
    return false
  }
} 

export { loginUser, authenticateSession }