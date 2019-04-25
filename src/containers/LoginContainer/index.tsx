import React from 'react';
import './LoginContainer.scss';
import Typography from '@material-ui/core/Typography';
import { TextField, Button, Checkbox, FormControlLabel, LinearProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import AppStore from '../../store/AppStore';

interface ILoginContainerProps {
  appStore?: AppStore;
}

@inject('appStore')
@observer
class LoginContainer extends React.Component<ILoginContainerProps> {
  state: { email: string; password: string } = {
    email: 'forwow495800@ya.ru',
    password: '123456',
  };

  public handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.currentTarget.value });
  };

  public handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.currentTarget.value });
  };

  public handleSubmit = () => {
    const { email, password } = this.state;
    const appStore = this.props.appStore!;
    appStore.signIn({ email, password });
  };

  public render() {
    const { email, password } = this.state;
    const appStore = this.props.appStore!;

    return (
      <div className="login-container">
        <div className="login-container__head">
          <Typography variant="h1">Sign in</Typography>
        </div>
        <div className="login-container__body">
          <TextField
            label="Email"
            required
            name="email"
            onChange={this.handleEmailChange}
            value={email}
            fullWidth
          />
          <TextField
            label="Password"
            required
            name="password"
            type="password"
            margin="normal"
            onChange={this.handlePasswordChange}
            value={password}
            fullWidth
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={appStore.signinLoading}
            onClick={this.handleSubmit}
            fullWidth
          >
            Sign in
          </Button>
          {appStore.signinLoading && <LinearProgress />}
          <div className="login-container__register">
            Have no account yet? <Link to="/registration">Register</Link> first, please.
          </div>
        </div>
      </div>
    );
  }
}

export default LoginContainer;
