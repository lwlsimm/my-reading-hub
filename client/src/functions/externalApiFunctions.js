import axios from 'axios';
import { keys } from '../assets/keys/keys';

//The function below returns an array of book objects from GoogleBook based on title and author supplied by the user.
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
    return data.data
  } catch (error) {
    return null
  }
}

const OLAdditionalCoverArtFinder = async (title) => {
  try {
    const isbnArray = []
    const verifiedLinks = []
    const path = keys.OL_SEARCH_PATH + title;
    const results = await axios.get(path);
    const resultsArray = await results.data.docs;
    await resultsArray.forEach(element => {
      if(element.isbn) {
       const elementIsbnArray = element.isbn;
        elementIsbnArray.forEach(isbn => {
          if(!isbnArray.includes(isbn)) {
            isbnArray.push(isbn)
          }
        }) 
      }
    });
    isbnArray.forEach(isbn => {
      const img = new Image();
      const path = keys.OL_COVER_PATH + isbn + '-M.jpg';
      img.src = path;
      const width = getWidthData(img);
      if(width > 5) {
        verifiedLinks.push(path)
      }
    })
    if(verifiedLinks.length < 1) {
      return []
    }
    return verifiedLinks;
  } catch (error) {
   return [] 
  }
}

const getWidthData = (obj) => {
  const width = obj.width;
  return width;
}

export { returnSearchResults, OLAdditionalCoverArtFinder }