import React from 'react';
import { Switch, Route } from "react-router-dom";

import Layout from './hoc/layout';
import Home from './components/Home';
import Login from './components/Register_login';
import Register from './components/Register_login/register';



const Routes = (props) => {
  return (
    <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register_login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
    </Layout>
  );
};

export default Routes;