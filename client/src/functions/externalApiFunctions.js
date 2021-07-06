import axios from 'axios';
import { keys } from '../assets/keys/keys';

const returnSearchResults = async(title, author) => {
  try {
    const data = await axios({
      method: 'POST',
      url: keys.SEARCH_PATH,
      data: {
        title: title,
        author: author
      }
    })
    console.log(data.data)
    return data.data
  } catch (error) {
    return null
  }
}

export { returnSearchResults }