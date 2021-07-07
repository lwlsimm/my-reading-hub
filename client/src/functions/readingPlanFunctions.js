export function constructReadingPlan (e, measure) {
  //extracting variables
  const {startDate,startAt,endAt,per_day, end_date, perDayType} = extractReadingPlanVariables(e);
  //work ou the number of days
  
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
        errorMessage.push('It looks like the data you provided was incomplete...  Please try again. ')
    }
    if(per_day && end_date) {
        errorMessage.push(`You can only enter either '${measureCapitalized} Per Day' or 'End Date' - not both.`)
        problemAreas.push('per_day', 'end_date')
    }
    if(!Number.isInteger(Number(per_day))){
      problemAreas.push('per_day')
      errorMessage.push(`The value for '${measure} Per Day' must be a whole number.`)
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
      return {validated: false, errorMessage: null, problemAreas: []}
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
