export const login = item => {
  return {
    type: 'login/login',
    payload: item
  }
}

export const logout = () => {
  return {
    type: 'login/logout'
  }
}

export const addSelectedBook = item => {
  return {
    type: 'selectBook/addSelectedBook',
    payload: item
  }
}

export const deleteSelectedBook = () => {
  return {
    type: 'selectBook/deleteSelectedBook'
  }
}

export const loadSearchItems = item => {
  return {
    type: 'search/loadSearchItems',
    payload: item
  }
}

export const deleteSearchItems = () => {
  return {
    type: 'search/deleteSearchItems'
  }
}

export const addReadingPlan = plan => {
  return {
    type: 'plan/addReadingPlan',
    payload: plan
  }
}

export const removeReadingPlan = planId => {
  return {
    type: 'plan/removeReadingPlan',
    payload: planId
  }
}

export const readingCompleted = (planId, day) => {
  return {
    type: 'plan/readingCompleted',
    payload: {planId: planId, day: day}
  }
}

export const clearPlans = () => {
  return {
    type: 'plan/clearPlans'
  }
}

