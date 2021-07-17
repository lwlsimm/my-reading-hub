import axios from 'axios';
import { keys } from '../assets/keys/keys';

async function settingsServerCall (token, path, dataObject = {}) {
  const data = await axios({
    method: 'post',
    headers: {
      authorization: `Bearer ${token}`
    },
    data: dataObject,
    url: path,
  });
  if(await data.data) {
    return true
  } else {
    return false
  }
}

async function changePassword (token, new_password, password) {
  const dataObj = {
      password: new_password,
      current_password: password,
    };
  const data = await settingsServerCall(token, keys.CHANGE_PW_PATH, dataObj)
  return data
}


async function changeEmail(token, email, password) {
  const dataObj = {
      email: email,
      current_password: password,
    }
  const data = await settingsServerCall(token, keys.CHANGE_EMAIL_PATH, dataObj)
  return data;
}

async function deleteAllPlansFromServer(token, password) {
  const dataObj = {
    current_password: password,
  }
  const data = await settingsServerCall(token, keys.DELETE_PLANS_PATH, dataObj)
  return data;
}

async function deleteAccount (token, password) {
  const dataObj = {
    current_password: password,
  }
  const data = await settingsServerCall(token, keys.DELETE_ACCOUNT_PATH, dataObj)
  return data;
}


export { changePassword, changeEmail, deleteAllPlansFromServer, deleteAccount }