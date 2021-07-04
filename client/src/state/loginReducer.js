const initialState = {
  loggedIn: false,
  token: null,
  id: null
}

const loginReducer = (state = initialState, action) => {
    switch(action.type) {
      case 'login/login': {
        return {loggedIn: true, token: action.payload['token'], expriy: action.payload['expiry'], id: action.payload['id']}
      };
      case 'login/logout': {
        return initialState;
      };
      default: {
        return state;
      }
    }
}

export default loginReducer;