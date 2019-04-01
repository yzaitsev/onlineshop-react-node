import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import userReducer, { moduleName as userModule } from '../ducks/user';


export default (history) => combineReducers({
  router: connectRouter(history),
  [userModule]: userReducer
})
