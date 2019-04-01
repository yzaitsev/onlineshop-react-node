import React from 'react';
import ReactDOM from 'react-dom';
import { ConnectedRouter } from 'connected-react-router';
import { Provider } from 'react-redux';
import store, { history } from './redux/store';

import './resources/css/styles.css';
import Routes from './routes';



ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}> 
        <Routes /> 
      </ConnectedRouter>
  </Provider>,
document.getElementById('root'));