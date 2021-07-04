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

