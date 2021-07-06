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

