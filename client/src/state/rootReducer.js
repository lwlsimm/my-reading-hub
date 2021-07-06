import loginReducer from './loginReducer';
import selectedBookReducer from './selectedBookReducer';
import searchReducer from './searchReducer';

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  loginReducer: loginReducer,
  selectedBookReducer: selectedBookReducer,
  searchReducer: searchReducer,
})

export default rootReducer;