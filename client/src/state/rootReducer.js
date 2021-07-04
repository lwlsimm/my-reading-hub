import loginReducer from './loginReducer';

import {combineReducers} from 'redux';

const rootReducer = combineReducers({
  loginReducer: loginReducer,
})

export default rootReducer;