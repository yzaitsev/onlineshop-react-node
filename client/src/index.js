import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './redux/store';

import './resources/css/styles.css';
import Routes from './routes';



ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes /> 
    </BrowserRouter>
  </Provider>,
document.getElementById('root'));