import React from 'react';
import './AuthScreen.scss';
import { Paper, Grow } from '@material-ui/core';
import LoginContainer from '../../containers/LoginContainer';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RegisterContainer from '../../containers/RegisterContainer';

class AuthScreen extends React.Component {
  public render() {
    return (
      <div className="auth-screen">
        <BrowserRouter>
          <Switch>
            <Route path="/" exact>
              <Grow in timeout={800}>
                <Paper className="auth-screen__login">
                  <LoginContainer />
                </Paper>
              </Grow>
            </Route>
            <Route path="/registration" exact>
              <Grow in timeout={800}>
                <Paper className="auth-screen__registration">
                  <RegisterContainer />
                </Paper>
              </Grow>
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default AuthScreen;
