import React       from 'react';
import { Route }   from 'react-router-dom';
import auth0Client from '../services/auth0/auth';

const SecuredRoute = (props) => {
  if (!auth0Client.isAuthenticated()) {
    auth0Client.signIn();
    return <div> Please Sign In</div>;
  }
  return <Route {...props} />;
};

export default SecuredRoute;
