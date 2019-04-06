import { call, put, take, all, delay } from 'redux-saga/effects';
import axios from 'axios';
import { appName } from '../config';
import { USER_SERVER } from './url-list';
import { push } from 'connected-react-router';
export const moduleName = 'user';
export const prefix = `${appName}/${moduleName}`;

/**
 * Constants
 */
export const LOGIN_REQUEST = `${prefix}/LOGIN_REQUEST`;
export const RGISTER_REQUEST = `${prefix}/RGISTER_REQUEST`;
export const RGISTER_REQUEST_SUCCESS = `${prefix}/RGISTER_REQUEST_SUCCESS`;
export const RGISTER_REQUEST_CLEAR = `${prefix}/RGISTER_REQUEST_CLEAR`;
export const RGISTER_REQUEST_ERROR = `${prefix}/RGISTER_REQUEST_ERROR`;



/**
 * Reducer
 */
export const intialState = {
  loading: false,
  registred: false,
  error: false
}

export default function reducer(state = intialState, action) {
  const { type, payload } = action;
  switch (type) {


    case RGISTER_REQUEST:
      return { ...state, loading: true };

    case RGISTER_REQUEST_SUCCESS: 
      return { ...state, loading: false, registred: true }

    case RGISTER_REQUEST_ERROR:
      return { ...intialState, error: true }

      case RGISTER_REQUEST_CLEAR:
      return { ...intialState }

    default: return state;
  }
}


/**
 * Action Creators
 */

export const register = (data) => ({
  type: RGISTER_REQUEST,
  payload: { data }
})



export const logIn = (data) => ({
  type: LOGIN_REQUEST,
  payload: { data }
})


/**
 * Sagas
 */
export function* loginInSaga() {
  const url = `${USER_SERVER}/login`;

  while(true) {
    const { payload } = yield take(LOGIN_REQUEST);
    try {
      const { data } = yield call([axios, axios.post], url, payload.data);
      
      console.log(`data: `, data)
    }catch(err) {
      console.log(err)
    }

  }
}



export function* registerSaga() {
  const url = `${USER_SERVER}/register`;
  while(true) {
    const { payload } = yield take(RGISTER_REQUEST);

    try {
      const { data } = yield call([axios, axios.post], url, payload.data );
      
      if (data.success) {
        console.log(`----- in saga`)
        yield put({ type: RGISTER_REQUEST_SUCCESS });
        yield delay(5000);
        yield put({ type: RGISTER_REQUEST_CLEAR });
        yield put(push('/register_login'));
      }


    } catch(err) {
      yield put({
        type: RGISTER_REQUEST_ERROR
      })
    }

  }
}










export const saga = function* () {
  yield all([
    loginInSaga(),
    registerSaga()
  ])
}