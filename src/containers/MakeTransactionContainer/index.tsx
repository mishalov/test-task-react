import React, { FormEvent } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import './MakeTransactionContainer.scss';
import { AutoComplite } from '../../components/AutoComplite/AutoComplite';
import { inject, observer } from 'mobx-react';
import AppStore from '../../store/AppStore';
import { userToOption } from '../../utils/userToOption';
import { toast } from 'react-toastify';
import { ValueType } from 'react-select/lib/types';

interface IMakeTransactionContainerProps {
  onCancel: () => void;
  onSend: (params: { id: number; count: number }) => void;
  appStore?: AppStore;
}

interface IMakeTransactionContainerState {
  autoComliteFilter: string;
  errors: {
    count: string;
    user: string;
  };
}

@inject('appStore')
@observer
class MakeTransactionContainer extends React.Component<
  IMakeTransactionContainerProps,
  IMakeTransactionContainerState
> {
  state = { autoComliteFilter: '', count: 0, errors: { count: '', user: '' } };

  public checkCount = (newCount: number) => {
    const { errors } = this.state;
    let newErros = { ...errors, count: '' };
    const loginedUser = this.props.appStore!.loginedUser!;
    if (loginedUser.balance === 0) newErros = { ...errors, count: 'Your balance is empty' };
    if (newCount === 0) newErros = { ...errors, count: 'Count is empty' };
    if (newCount > loginedUser.balance) newErros = { ...errors, count: 'Not enough PW' };
    this.setState({ errors: newErros });
    return Boolean(!newErros.count);
  };

  public handleChangeCount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const appStore = this.props.appStore!;
    const newCount = Number(e.currentTarget.value);
    this.checkCount(newCount);
    appStore.setCountToSend(newCount);
  };

  public handleChangeUser = (param: ValueType<{ label: string; value: number }>) => {
    const appStore = this.props.appStore!;
    if (param && !(param instanceof Array)) {
      const user = appStore.userList.find(usr => usr.id === param.value);
      if (!user) {
        appStore.setUserToSend('');
        return;
      }
      appStore.setUserToSend(user.name);
    } else {
      appStore.setUserToSend('');
    }
  };

  public handleChangeUserFilter = (label: string) => {
    if (label !== '') {
      const appStore = this.props.appStore!;
      appStore.setUserFilter(label);
      appStore.fetchUserListThrottled(label);
      appStore.setUserToSend('');
    }
  };

  public handleMakeTransaction = () => {
    const appStore = this.props.appStore!;
    const { userFilter } = appStore;
    const tryByFilter = appStore.userList.find(user => user.name === userFilter);
    const userToSend = appStore.userToSend ? appStore.userToSend : tryByFilter && tryByFilter.name;
    if (!userToSend) {
      toast.error('Choose the recipient please!');
      return;
    }
    const valid = this.checkCount(appStore.countToSend);
    if (valid) {
      appStore.makeTransaction({ name: userToSend, amount: appStore.countToSend });
    }
  };

  public render() {
    const { onCancel, onSend } = this.props;
    const { autoComliteFilter, errors } = this.state;
    const appStore = this.props.appStore!;
    const count = appStore.countToSend;
    const { userList } = appStore;
    return (
      <div className="make-transaction-container">
        <div className="make-transaction-container__body">
          <Typography variant="h1">Make transaction</Typography>
          <div className="make-transaction-container__description">
            <Typography variant="subheading">
              Choose recipient and insert count of PW to send
            </Typography>
          </div>

          <AutoComplite
            onFilter={this.handleChangeUserFilter}
            onChange={this.handleChangeUser}
            options={userList.map(user => userToOption(user))}
            current={appStore.userToSend}
            inputValue={appStore.userFilter}
          />
          <TextField
            margin="normal"
            label="Count"
            required
            name="count"
            type="number"
            onChange={this.handleChangeCount}
            error={Boolean(errors.count)}
            helperText={errors.count}
            value={count}
            fullWidth
          />
        </div>
        <div className="make-transaction-container__footer">
          <Button color="primary" onClick={onCancel}>
            Cancel
          </Button>
          <Button color="primary" onClick={this.handleMakeTransaction}>
            Accept
          </Button>
        </div>
      </div>
    );
  }
}

export default MakeTransactionContainer;
