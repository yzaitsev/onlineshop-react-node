import { combineReducers } from 'redux';
import userReducer, { moduleName as userModule } from '../ducks/user';


const rootReducer = combineReducers({
  [userModule]: userReducer
})

export default rootReducer;