import React, { Component } from 'react';
import { connect } from 'react-redux';
import { moduleName, userAuth } from '../ducks/user';
import { replace } from 'connected-react-router';
import CircularProgress from '@material-ui/core/CircularProgress';

export default function(ComposedClass,reloadRoute,adminRoute = null){
    class AuthenticationCheck extends Component {


        componentDidMount() {
         this.props.userAuth(reloadRoute, adminRoute);
        }


        render() {
          const { user } = this.props; 
          if(this.props.loading) {
            console.log(`---render`, this.props.loading)
              return (
                <div className="main_loader">
                    <CircularProgress style={{color:'#2196F3'}} thickness={7}/> 
                </div>
              )
          }

          return <ComposedClass {...this.props} user={user}/>;
        }
    }


    return connect(state => ({
      user: state[moduleName].profile,
      loading: state[moduleName].loading,
    }), { userAuth, replace })(AuthenticationCheck)
}


