
const validateEmail = (email) => {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)){
     return true
   }
   return false
 }

 const covertSearchString = (string) => {
  let searchParams = (string).toLowerCase();
  searchParams = searchParams.replaceAll(/[.,\/#'!$%\^&\*;:{}=\-_`~()]/g,"")
  searchParams = searchParams.replaceAll(" ", "+");
  return searchParams;
 }

 //This function takes in an object and an array of strings which are the names of nested properties that you wish to extract.  For example, if you want to extract person.name.first_name then person would be the object and the array would be ['name', 'first_name'].  On error, a third argument is returned (or a blank string if not specified).
 const extractItemFromObject = (arrayOfItemsToExtract, objectToExtractFrom, returnOnError = '') => {
   try {
     let currentObject = objectToExtractFrom
     for(let i = 0; i < arrayOfItemsToExtract.length; i++) {
       currentObject = currentObject[arrayOfItemsToExtract[i]]
     }
     return currentObject
   } catch (error) {
     return returnOnError
   }
 }


 export { validateEmail, extractItemFromObject, covertSearchString  }