import { appName } from '../config';

export const moduleName = 'user';
export const prefix = `${appName}/${moduleName}`;

// Actions
const LOAD = `${prefix}/LOAD`;


// Reducer
export default function reducer(state = {}, action = {}) {
  switch (action.type) {
    // do reducer stuff
    default: return state;
  }
}

// Action Creators
export function loadWidgets() {
  return { type: LOAD };
}
