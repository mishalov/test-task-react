export interface IUserSignupParams {
  username: string;
  password: string;
  email: string;
}

export interface IUserSigninParams {
  email: string;
  password: string;
}

export interface IUser {
  id: number;
  name: string;
  email: string;
  balance: number;
}

export interface IFiltredUser {
  id: number;
  name: string;
}

export interface IMakeTransactionItem {
  name: string;
  amount: number;
}

export interface ITransactionItem {
  id: number;
  date: string;
  username: string;
  amount: number;
  balance: number;
  [key: string]: amy;
}
