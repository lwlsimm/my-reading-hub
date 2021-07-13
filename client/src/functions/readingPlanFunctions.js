import { ReadingPlan } from '../classes/ReadingPlan';
import axios from 'axios';
import { keys } from '../assets/keys/keys';

export function constructReadingPlan (e, measure, bookObj) {
  //extracting variables
  const { startDate,startAt,endAt,per_day, end_date, perDayType } = extractReadingPlanVariables(e);
  const id = createBookId(bookObj);
  //create new Reading Plan object
  const readingPlanObj = new ReadingPlan(id, startDate, startAt, endAt, per_day, end_date, perDayType, measure, bookObj);
  const scheme = readingPlanObj.create_new_plan;
  readingPlanObj.plan_scheme = scheme;
  return readingPlanObj;
}

export async function deletePlanFromServer (planId, token) {
  try {
      const data = await axios({
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`
      },
      url: keys.DELETE_PLAN_ON_DB_PATH,
      data: {
        plan_id: planId,
      }
    });
    if(await data.data) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export async function sendNewPlanToServer (plan, token) {
  try {
    const data = await axios({
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`
      },
      url: keys.ADD_NEW_PLAN_TO_DB_PATH,
      data: {
        plan: {
          plan_id: plan.id,
          plan_details: JSON.stringify(plan.obtain_basic_details),
          plan_scheme: JSON.stringify(plan.create_new_plan)
        }
      }
    });
    if(await data.data){
      return true
    } 
    return false;
  } catch (error) {
    return false;
  }
}

export async function updateExistingPlan (plan_id, scheme, token) {
  const json_scheme = JSON.stringify(scheme)
  try {
    const data = await axios({
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`
      },
      url: keys.UPATE_PLAN_ON_DB_PATH,
      data: {
        plan_id: plan_id,
        scheme: json_scheme
      }
    });
    if(await data.data){
      return true
    } 
    return false;
  } catch (error) {
    return false;
  }
}

function createBookId (bookObj) {
  const timeNow = new Date();
  const timeInMss = timeNow.getTime();
  const title = bookObj.title.replaceAll(/[.,\/#'!$%\^&\*;:{}=\-_`~()]/g,"").replaceAll(" ","");
  const randomNumber = Math.floor(Math.random() * 2000000);
  const id = String(`${timeInMss}${title}${randomNumber}`);
  return id;
}

export function readingPlanValidateInputs (e, measure) {
  try {
    const {startDate,startAt,endAt,per_day, end_date} = extractReadingPlanVariables(e);
    const measureCapitalized = measure.charAt(0).toUpperCase() + measure.slice(1)
    const dateToday = Date.now();
    const errorMessage = [];
    const problemAreas = []
    if(!startDate || !startAt || !endAt) {
        problemAreas.push('startAt','endAt');
        errorMessage.push('It looks like the data you provided was incomplete... Please try again. ')
    }
    if(per_day && end_date) {
        errorMessage.push(`You can only enter either '${measureCapitalized} Per Day' or 'End Date' - not both.`)
        problemAreas.push('per_day', 'end_date')
    }
    if(!Number.isInteger(Number(per_day))){
      problemAreas.push('per_day')
      errorMessage.push(`The value for '${measureCapitalized} Per Day' must be a whole number.`)
    }
    if(end_date && (end_date < startDate || end_date < dateToday)) {
        if(end_date < dateToday ) {
          problemAreas.push('end_date')
        } else {
          problemAreas.push('end_date','startDate')
        }
        errorMessage.push("The 'End Date' cannot be before the Start Date or in the past. ");
    }
    if(!Number.isInteger(Number(startAt))||!Number.isInteger(Number(endAt))) {
        if(!Number.isInteger(Number(startAt))) {
          problemAreas.push('startAt')
        }
        if(!Number.isInteger(Number(endAt))) {
          problemAreas.push('endAt')
        }
        errorMessage.push(`Both the 'Starting ${measure}' and 'End ${measure}' must be whole numbers.`) 
    }
    if(Number(startAt) >= Number(endAt)) {
        errorMessage.push(`The number of the 'Starting ${measure}' must be before the number of the 'End ${measure}'`) 
        problemAreas.push('startAt','endAt')
    }
    if(problemAreas.length > 0) {
      return {validated: false, errorMessage: errorMessage, problemAreas: problemAreas}
    } else {
      return {validated: true, errorMessage: null, problemAreas: []}
    }
  } catch(err) {
        return {validated: false, errorMessage: 'Hmmm... For some reason, it looks like there was an error.  Please make sure all details are enetered correctly and contact us via the About button at the top of the page if the problem persists.'}
  }
}

export function extractReadingPlanVariables(e) {
    const startAt = e.target.startAt.value;
    const startDate = e.target.startDate.value;
    const endAt = e.target.endAt.value;
    const end_date = e.target.end_date.value;
    const per_day = e.target.per_day.value;
    let perDayType
    if(per_day) {
      perDayType = 'per_day'
    } else {
      perDayType = 'end_date'
    }
    const returnObject = {
      startAt: startAt,
      startDate: startDate,
      endAt: endAt,
      end_date: end_date,
      per_day: per_day,
      perDayType: perDayType
    }
    return returnObject
}

export function updatePlanReadToAndFrom (updatedPageNum, ToOrFrom, day, scheme) {

}
