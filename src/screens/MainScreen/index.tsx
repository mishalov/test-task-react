import React from 'react';
import './MainScreen.scss';
import TopBarContainer from '../../containers/TopBarContainer';
import { inject, observer } from 'mobx-react';
import AppStore from '../../store/AppStore';
import { Drawer, Typography } from '@material-ui/core';
import MakeTransactionContainer from '../../containers/MakeTransactionContainer';
import RecentContainer from '../../containers/RecentContainer';

interface IMainScreenProps {
  appStore?: AppStore;
}

interface IMainScreenState {}

@inject('appStore')
@observer
class MainScreen extends React.Component<IMainScreenProps, IMainScreenState> {
  public handleOpenMakeTransaction = () => {
    const appStore = this.props.appStore!;
    appStore.setDrawerIsOpened(true);
  };

  public handleCloseMakeTransaction = () => {
    const appStore = this.props.appStore!;
    appStore.setDrawerIsOpened(false);
  };

  public render() {
    const appStore = this.props.appStore!;
    const { drawerIsOpened } = appStore;
    const loginedUser = appStore.loginedUser!;
    return (
      <div className="main-screen">
        <div className="main-screen__head">
          <TopBarContainer handleHamburgerClick={this.handleOpenMakeTransaction} />
          <div className="main-screen__subhead">
            <Typography inline variant="h4">
              Current balance:
              <Typography inline color="primary">
                {` ${loginedUser.balance} `}
              </Typography>
              PW
            </Typography>
          </div>
        </div>
        <Drawer open={drawerIsOpened} onClose={this.handleCloseMakeTransaction}>
          <MakeTransactionContainer
            onCancel={this.handleCloseMakeTransaction}
            onSend={this.handleCloseMakeTransaction}
          />
        </Drawer>
        <RecentContainer />
      </div>
    );
  }
}

export default MainScreen;
