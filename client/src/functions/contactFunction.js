import axios from 'axios';
import { keys } from '../assets/keys/keys';


async function sendContactFormtoServer(email, message, token) {
  try {
    const contactPath = keys.ABOUT_CONTACT_PATH;
    const data = await axios({
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`
      },
      url: contactPath,
      data: {
        email: email,
        message: message
      }
    });
    return await data.data;
  } catch (error) {
    return false
  }
}

export { sendContactFormtoServer }