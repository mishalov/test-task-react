import React, { SyntheticEvent } from 'react';
import AppBar from '@material-ui/core/AppBar';
import './TopBarContainer.scss';
import { Toolbar, IconButton, Typography, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { inject, observer } from 'mobx-react';
import AppStore from '../../store/AppStore';

interface ITopBarContainerProps {
  appStore?: AppStore;
  handleHamburgerClick: () => void;
}

interface ITopBarContainerState {
  userMenuOpened: boolean;
}

@inject('appStore')
@observer
class TopBarContainer extends React.Component<ITopBarContainerProps, ITopBarContainerState> {
  state = { userMenuOpened: false };
  anchorEl = React.createRef<any>();

  public handleOpenUserMenu = (e: SyntheticEvent) => {
    this.setState({ userMenuOpened: true });
  };
  public handleCloseUserMenu = () => {
    this.setState({ userMenuOpened: false });
  };

  public render() {
    const appStore = this.props.appStore!;
    const loginedUser = appStore.loginedUser!;
    const { isMobile } = appStore;
    const { anchorEl } = this;
    const { userMenuOpened } = this.state;
    return (
      <AppBar position="static" className="top-bar-container">
        <Toolbar>
          <IconButton color="inherit" aria-label="Menu" onClick={this.props.handleHamburgerClick}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" className="top-bar-container__title">
            {isMobile ? 'PW💸' : 'Parrot Wings💸'}
          </Typography>
          <div className="top-bar-container__user-group">
            {loginedUser.name}
            <div ref={this.anchorEl}>
              <IconButton
                onClick={this.handleOpenUserMenu}
                aria-owns={open ? 'menu-appbar' : undefined}
                aria-haspopup="true"
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </div>
            <Menu
              id="menu-appbar"
              anchorEl={this.anchorEl.current}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={userMenuOpened}
              onClose={this.handleCloseUserMenu}
            >
              <MenuItem onClick={appStore.logout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBarContainer;
