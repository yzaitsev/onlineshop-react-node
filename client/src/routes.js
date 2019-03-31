import React from 'react';
import { Switch, Route } from "react-router-dom";

import Layout from './hoc/layout';
import Home from './components/Home';
import Login from './components/Register_login';



const Routes = (props) => {
  return (
    <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/register_login" exact component={Login} />
        </Switch>
    </Layout>
  );
};

export default Routes;