import { call, put, take, all } from 'redux-saga/effects';
import axios from 'axios';
import { replace } from 'history';
import { appName } from '../config';
import { USER_SERVER } from './url-list';

export const moduleName = 'user';
export const prefix = `${appName}/${moduleName}`;

// Actions
const LOGIN_REQUEST = `${prefix}/LOGIN_REQUEST`;


// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    // do reducer stuff
    case LOGIN_REQUEST: {
      console.log(`---- run changes in reducer by type LOGIN_REQUEST`);
      return state;
    }

    default: return state;
  }
}


// Action Creators
export function logIn(data) {
  return {
    type: LOGIN_REQUEST,
    payload: { data }
  }
}

// saga login handler
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







export const saga = function* () {
  yield all([
    loginInSaga()
  ])
}