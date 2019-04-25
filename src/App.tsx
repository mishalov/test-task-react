import React, { Component } from 'react';
import AuthScreen from './screens/AuthScreen';
import dayjs from 'dayjs';
import './App.scss';
import { createMuiTheme, MuiThemeProvider, Snackbar } from '@material-ui/core';
import { Route, Switch, Router, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import AppStore from './store/AppStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { history } from './utils/history';
import MainScreen from './screens/MainScreen';
dayjs.locale('ru');

const theme = createMuiTheme({
  typography: {
    h1: {
      fontSize: 24,
      lineHeight: '36px',
      fontWeight: 400,
      fontFamily: 'Roboto',
    },
    h2: {
      fontSize: 20,

      fontFamily: 'Roboto',
    },
    h3: {
      fontSize: 18,
      fontFamily: 'Roboto',
    },
    h4: {
      fontSize: 16,
      fontFamily: 'Roboto',
    },
    h5: {
      fontSize: 14,
      fontFamily: 'Roboto',
    },
  },
});

const protectedRoutes = [
  <Route path="/list" exact key={0}>
    <MainScreen />
  </Route>,
];

interface IAppProps {
  appStore?: AppStore;
}

@inject('appStore')
@observer
class App extends Component<IAppProps> {
  state = { windowHeight: window.innerHeight };

  public componentDidMount() {
    this.checkIfMobile();
    window.addEventListener('resize', () => {
      this.setState({ windowHeight: window.innerHeight });
      this.checkIfMobile();
    });
    this.props.appStore!.checkIfLoginedIn();
  }

  public checkIfMobile() {
    const appStore = this.props.appStore!;
    if (window.innerWidth < 768) appStore.setIsMobile(true);
    else appStore.setIsMobile(false);
  }

  public render() {
    const { windowHeight } = this.state;
    const appStore = this.props.appStore!;
    const style: React.CSSProperties = {
      height: windowHeight,
    };
    return (
      <div className="app" style={style}>
        <ToastContainer />
        <MuiThemeProvider theme={theme}>
          <Router history={history}>
            <Switch>
              {appStore.isLoggined ? protectedRoutes : <Redirect from="/list" to="/" />}
              <Route path="/">
                <AuthScreen />
              </Route>
            </Switch>
          </Router>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
