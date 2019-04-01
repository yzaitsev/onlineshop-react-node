import { createBrowserHistory } from 'history';
import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './saga';
import logger from 'redux-logger';
import rootReducer from './reducer';

export const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware()

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ 
    ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) 
    : 
    compose;



const enhancer = composeEnhancers(
  applyMiddleware(routerMiddleware(history), sagaMiddleware, logger),
);

const store = createStore(rootReducer(history), enhancer);

sagaMiddleware.run(rootSaga);

export default store;