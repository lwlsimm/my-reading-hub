
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

 function formatDateForSafari(inputDate) {
   console.log('a')
  const dateInput = String(inputDate);
  let day = Number(dateInput.slice(0,2));
  const month = Number(dateInput.slice(3,5));
  const year = Number(dateInput.slice(6,10));
  let max;
  if(dateInput.length !== 10 || month > 12 || year < 2000 || year > 2100 || day === NaN || month === NaN|| year === NaN)  {
    return null
  }
  switch(month) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12:
      max = 31;
    break;
    case 2:
      max = 29;
    break;
    default:
      max = 30;
  }
  if(day > max)day = max;
  const newDate = new Date();
  newDate.setDate(day);newDate.setMonth(month-1);newDate.setFullYear(year);newDate.setHours(0,0,0,0);
  if(isNaN(newDate.getTime())) return null;
  return newDate;
}


 function formatDate(date) {
  const options = {year: 'numeric', month: 'numeric', day: 'numeric'};
  const reformedDate = new Date(date).toLocaleDateString('en-UK', options).toString();
  return String(`${reformedDate.slice(6,10)}-${reformedDate.slice(3,5)}-${reformedDate.slice(0,2)}`)
  }


 export { validateEmail, extractItemFromObject, covertSearchString, formatDate, formatDateForSafari }