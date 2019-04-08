import { call, put, take, all, delay } from 'redux-saga/effects';
import axios from 'axios';
import { appName } from '../config';
import { USER_SERVER } from './url-list';
import { push, replace } from 'connected-react-router';


/**
 * Constants
 */
export const moduleName = 'user';
export const prefix = `${appName}/${moduleName}`;

export const LOGIN_REQUEST = `${prefix}/LOGIN_REQUEST`;
export const LOGIN_REQUEST_SUCCESS = `${prefix}/LOGIN_REQUEST`;

export const RGISTER_REQUEST = `${prefix}/RGISTER_REQUEST`;
export const RGISTER_REQUEST_SUCCESS = `${prefix}/RGISTER_REQUEST_SUCCESS`;
export const RGISTER_REQUEST_CLEAR = `${prefix}/RGISTER_REQUEST_CLEAR`;
export const RGISTER_REQUEST_ERROR = `${prefix}/RGISTER_REQUEST_ERROR`;

export const USER_AUTH_REQUEST = `${prefix}/USER_AUTH_REQUEST`;
export const USER_AUTH_SUCCESS = `${prefix}/USER_AUTH_SUCCESS`;
export const USER_AUTH_ERROR = `${prefix}/USER_AUTH_ERROR`;



/**
 * Reducer
 */
export const intialState = {
  loading: false,
  registred: false,
  error: false,
  profile: {
    isAdmin: false,
    isAuth: false,
  }
}

export default function reducer(state = intialState, action) {
  const { type, payload } = action;
  switch (type) {

    case LOGIN_REQUEST:
    case USER_AUTH_REQUEST:
    case RGISTER_REQUEST:
      return { ...state, loading: true };

    case RGISTER_REQUEST_SUCCESS: 
      return { ...state, loading: false, registred: true }

    case LOGIN_REQUEST_SUCCESS:
    case USER_AUTH_SUCCESS:
      return { ...state, loading: false, profile: payload.profile }

    case RGISTER_REQUEST_ERROR:
      return { ...intialState, error: true }

    case USER_AUTH_ERROR:
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

export const userAuth = (reloadRoute, adminRoute) => ({
  type: USER_AUTH_REQUEST,
  payload: { reloadRoute, adminRoute }
})


/**
 * Sagas
 */
export function* loginInSaga() {
  const url = `${USER_SERVER}/login`;

  while(true) {
    const { payload } = yield take(LOGIN_REQUEST);
    try {
      const { data: {user: profile} } = yield call([axios, axios.post], url, payload.data);
      yield put({
        type: LOGIN_REQUEST_SUCCESS,
        payload: { profile }
      })
      yield put(replace('/user/dashboard'));
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


export function* userAuthSaga() {
  const url = `${USER_SERVER}/auth`;

  while(true) {
    const { payload: { reloadRoute, adminRoute } } = yield take(USER_AUTH_REQUEST);

    try {
      const { data:profile } = yield call([axios, axios.get], url);
      
      yield put({
        type: USER_AUTH_SUCCESS,
        payload: { profile }
      })
      
      if (adminRoute && !profile.isAdmin) {
        return yield put(replace('/user/dashboard'));
      }
    
      if (reloadRoute === false){
        return yield put(replace('/user/dashboard'));
      }

    } catch(err) {
      if (reloadRoute){
        yield put(replace('/register_login'))
      }
      yield put({ type: USER_AUTH_ERROR })
    }
  }
}







export const saga = function* () {
  yield all([
    loginInSaga(),
    registerSaga(),
    userAuthSaga()
  ])
}