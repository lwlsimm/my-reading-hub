const searchReducer = (state = {}, action) => {
  switch(action.type) {
    case 'search/loadSearchItems': {
      return action.payload
    };
    case 'search/deleteSearchItems': {
      return {}
    };
    default: {
      return state;
    }
  }
}

export default searchReducer;