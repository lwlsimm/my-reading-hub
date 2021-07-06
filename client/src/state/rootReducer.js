import loginReducer from './loginReducer';
import selectedBookReducer from './selectedBookReducer';

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  loginReducer: loginReducer,
  selectedBookReducer: selectedBookReducer,
})

export default rootReducer;