import loginReducer from './loginReducer';
import selectedBookReducer from './selectedBookReducer';
import searchReducer from './searchReducer';
import planReducer from './planReducer';

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  loginReducer: loginReducer,
  selectedBookReducer: selectedBookReducer,
  searchReducer: searchReducer,
  planReducer: planReducer,
})

export default rootReducer;