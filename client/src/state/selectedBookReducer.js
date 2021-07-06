const selectedBookReducer = (state = {}, action) => {
  switch(action.type) {
    case 'selectBook/addSelectedBook': {
      return action.payload
    };
    case 'selectBook/deleteSelectedBook': {
      return {}
    };
    default: {
      return state;
    }
  }
}

export default selectedBookReducer;