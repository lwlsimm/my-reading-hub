import axios from 'axios';
import { keys } from '../assets/keys/keys';

async function changePassword (token, new_password, password) {
  const data = await axios({
    method: 'post',
    headers: {
      authorization: `Bearer ${token}`
    },
    data: {
      password: new_password,
      current_password: password,
    },
    url: keys.CHANGE_PW_PATH,
  });
  if(await data.data) {
    return true
  } else {
    return false
  }
}

async function changeEmail(token, email, password) {
  const data = await axios({
    method: 'post',
    headers: {
      authorization: `Bearer ${token}`
    },
    data: {
      email: email,
      current_password: password,
    },
    url: keys.CHANGE_EMAIL_PATH,
  });
  if(await data.data) {
    return true
  } else {
    return false
  }
}

export { changePassword, changeEmail }