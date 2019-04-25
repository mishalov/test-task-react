import React from 'react';
import './RegisterContainer.scss';
import Typography from '@material-ui/core/Typography';
import { TextField, Button, LinearProgress } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import AppStore from '../../store/AppStore';

interface IRegistrationForm {
  email: string;
  password: string;
  passwordConfirmation: string;
  username: string;
  [key: string]: string;
}

interface IRegistrationContainerProps {
  appStore?: AppStore;
}

@inject('appStore')
@observer
class RegisterContainer extends React.Component<IRegistrationContainerProps> {
  state = {
    email: '',
    password: '',
    passwordConfirmation: '',
    username: '',
    errors: {
      email: '',
      password: '',
      passwordConfirmation: '',
      username: '',
    },
  };

  public handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: e.currentTarget.value });
  };

  public handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ email: e.currentTarget.value });
  };

  public handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ password: e.currentTarget.value });
  };

  public handleChangePasswordConfirmation = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ passwordConfirmation: e.currentTarget.value });
  };

  public handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, email, password, passwordConfirmation } = this.state;
    const appStore = this.props.appStore!;
    const errors: IRegistrationForm = {
      email: '',
      password: '',
      passwordConfirmation: '',
      username: '',
    };
    const wrongFieldLabel = 'Please check this field';
    /** Валидируем Email */
    const emailRegExp = /\S+@\S+\.\S+/;
    if (!emailRegExp.test(email)) errors.email = wrongFieldLabel;
    /** Валидируем юзернейм */
    if (username.length === 0) errors.username = wrongFieldLabel;
    /** Валидируем пароль */
    if (password.length < 6) errors.password = '6 symbols atleast';
    if (password !== passwordConfirmation)
      errors.passwordConfirmation = 'Confirmation dont match the password';
    this.setState({ errors });
    for (const key in errors) {
      if (errors[key] !== '') {
        return;
      }
    }

    appStore.signUp({ username, email, password });
  };

  public render() {
    const { username, email, password, passwordConfirmation, errors } = this.state;
    const appStore = this.props.appStore!;
    return (
      <div className="registration-container">
        <div className="registration-container__head">
          <Typography variant="h1">Sign up</Typography>
        </div>
        <div className="registration-container__body">
          <form onSubmit={this.handleSubmit}>
            <TextField
              label="Email"
              onChange={this.handleChangeEmail}
              error={!!errors.email}
              helperText={errors.email}
              value={email}
              name="email"
              fullWidth
              required={true}
            />
            <TextField
              margin="dense"
              label="Username"
              error={!!errors.username}
              helperText={errors.username}
              onChange={this.handleChangeUsername}
              value={username}
              name="username"
              fullWidth
              required={true}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              error={!!errors.password}
              helperText={errors.password}
              onChange={this.handleChangePassword}
              name="password"
              value={password}
              required={true}
              fullWidth
            />
            <TextField
              label="Repeat password"
              margin="dense"
              type="password"
              error={!!errors.passwordConfirmation}
              helperText={errors.passwordConfirmation}
              onChange={this.handleChangePasswordConfirmation}
              name="repeatPassword"
              value={passwordConfirmation}
              required={true}
              fullWidth
            />
            <div className="registration-container__submit">
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={appStore.signupLoading}
                fullWidth
              >
                Submit
              </Button>
              {appStore.signupLoading && <LinearProgress />}
            </div>
          </form>

          <div className="registration-container__register">
            Have an account? <Link to="/">Sign in</Link>, please
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterContainer;
