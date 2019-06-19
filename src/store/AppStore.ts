import { observable, action } from 'mobx';
import {
  IUserSignupParams,
  IUserSigninParams,
  IUser,
  IFiltredUser,
  IMakeTransactionItem,
  ITransactionItem,
} from '../module';
import { api } from './api';
import { toast } from 'react-toastify';
import { AxiosResponse } from 'axios';
import { makeGreet } from '../utils/makeGreet';
import { history } from '../utils/history';
import { throttle } from '../utils/throttle';

export default class AppStore {
  @observable
  public userFilter: string = '';
  @observable
  public userToSend: string = '';
  @observable
  public countToSend: number = 0;
  @observable
  public signupLoading = false;
  @observable
  public signinLoading = false;
  @observable
  public isMobile = false;
  @observable
  public drawerIsOpened = false;
  @observable
  public loginedUser?: IUser;
  @observable
  public isLoggined = false;
  @observable
  public userList: IFiltredUser[] = [];
  @observable
  public recentTransactions: ITransactionItem[] = [];

  private makeAxiosError = (e: any) => {
    const response: AxiosResponse = e.response;
    toast.error(response.data);
  };

  @action
  public signUp = async (params: IUserSignupParams) => {
    try {
      const { data } = await api.post({ url: 'users', data: params });
      sessionStorage.setItem('id_token', data.id_token);
      toast.success("Signed up successfully! You'll be Logined in in few seconds");
      await this.handleLoginedInfo();
      history.push('/list');
    } catch (e) {
      this.makeAxiosError(e);
    }
  };

  @action
  public signIn = async (params: IUserSigninParams) => {
    try {
      this.signinLoading = true;
      const { data } = await api.post({ url: 'sessions/create', data: params });
      sessionStorage.setItem('id_token', data.id_token);
      await this.handleLoginedInfo();
      history.push('/list');
    } catch (e) {
      this.makeAxiosError(e);
    } finally {
      this.signinLoading = false;
    }
  };

  @action handleLoginedInfo = async (checkOnly?: boolean) => {
    try {
      const { data } = await api.get({ url: 'api/protected/user-info' });
      this.loginedUser = data.user_info_token;
      this.isLoggined = true;
      if (!checkOnly) toast.success(`${makeGreet()}`);
      return true;
    } catch (e) {
      if (!checkOnly) this.makeAxiosError(e);
      history.push('/');
      return false;
    }
  };

  @action
  public checkIfLoginedIn = async () => {
    const loggined = await this.handleLoginedInfo(true);
    if (!loggined) return;
    history.push('/list');
  };

  @action
  public logout = () => {
    this.isLoggined = false;
    sessionStorage.removeItem('id_token');
    history.push('/');
  };

  @action
  public fetchUserList = async (filter: string) => {
    if (!filter) return;
    try {
      const { data } = await api.post({ url: 'api/protected/users/list', data: { filter } });
      this.userList = data;
    } catch (e) {
      this.makeAxiosError(e);
    }
  };

  @action
  public makeTransaction = async (transactionParam: IMakeTransactionItem) => {
    try {
      const { data } = await api.post({
        url: 'api/protected/transactions',
        data: transactionParam,
      });
      this.handleLoginedInfo(true);
      toast.success(`Transaction done: ${Math.abs(data.trans_token.amount)} pw sent`);
      this.fetchRecentTransactions();
      this.setDrawerIsOpened(false);
    } catch (e) {
      this.makeAxiosError(e);
    }
  };

  @action fetchRecentTransactions = async () => {
    try {
      const { data } = await api.get({ url: 'api/protected/transactions' });
      if (!(data.trans_token instanceof Array)) throw 'Array of transaction is invalid!';
      this.recentTransactions = data.trans_token;
    } catch (e) {
      this.makeAxiosError(e);
    }
  };

  @action
  public setUserToSend = (userToSend: string) => {
    this.userToSend = userToSend;
  };

  @action
  public setCountToSend = (countToSend: number) => {
    this.countToSend = Math.abs(countToSend);
  };

  @action.bound
  public setIsMobile = (isMobile: boolean) => {
    this.isMobile = isMobile;
  };

  @action
  public setDrawerIsOpened = (isOpened: boolean) => {
    this.drawerIsOpened = isOpened;
  };

  @action
  public setUserFilter = (userFilter: string) => {
    this.userFilter = userFilter;
  };

  //Данный метод "тормозится", чтобы не спамить на сервер запросами на воод каждого символа
  @action.bound
  public fetchUserListThrottled = throttle(this.fetchUserList, 2000);
}
