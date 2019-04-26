import React from 'react';
import './RecentContainer.scss';
import { Typography, Link, Input, Menu, MenuItem } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import AppStore from '../../store/AppStore';
import TransactionCard from '../../components/TransactionCard';
import 'dayjs/locale/en';
import dayjs from 'dayjs';
import { ITransactionItem } from '../../module';

const toDate = (date: string) => {
  return dayjs(date)
    .locale('en')
    .format('DD.MM.YYYY');
};

const sortTransactions = (t1: ITransactionItem, t2: ITransactionItem, sort: ISortMenuItem) => {
  const { field } = sort;
  const field1 = sort.field === 'date' ? dayjs(t1.date).unix() : t1[field];
  const field2 = sort.field === 'date' ? dayjs(t2.date).unix() : t2[field];
  if (sort.asc) {
    return field1 < field2 ? -1 : field1 > field2 ? 1 : 0;
  } else {
    return field1 < field2 ? 1 : field1 > field2 ? -1 : 0;
  }
};

interface IRecentContainerProps {
  appStore?: AppStore;
}

interface IFilterMenuItem {
  field: string;
  title: string;
}

interface ISortMenuItem {
  field: string;
  asc: boolean;
  title: string;
}

interface IRecentContainerState {
  filter: IFilterMenuItem;
  sort: ISortMenuItem;
  filterIsOpened: boolean;
  sortIsOpened: boolean;
  filterString: string;
}

const sortOptions = [
  { field: 'username', asc: false, title: 'Username (desc)' },
  { field: 'username', asc: true, title: 'Username (asc)' },
  { field: 'amount', asc: false, title: 'Amount (desc)' },
  { field: 'amount', asc: true, title: 'Amount (asc)' },
  { field: 'date', asc: false, title: 'Date (desc)' },
  { field: 'date', asc: true, title: 'Date (asc)' },
];

const filterOptions = [
  { field: 'username', title: 'Username' },
  { field: 'amount', title: 'Amount' },
  { field: 'date', title: 'Date' },
];

@inject('appStore')
@observer
class RecentContainer extends React.Component<IRecentContainerProps, IRecentContainerState> {
  state = {
    sort: { field: 'date', asc: false, title: '↓ Date' },
    filter: { field: 'date', title: 'Date' },
    filterIsOpened: false,
    sortIsOpened: false,
    filterString: '',
  };
  recentBody = React.createRef<HTMLDivElement>();
  filterLabel = React.createRef<HTMLDivElement>();
  sortLabel = React.createRef<HTMLDivElement>();

  public componentDidMount() {
    const appStore = this.props.appStore!;
    appStore.fetchRecentTransactions();
  }

  public handleWheelOnBody = (e: React.WheelEvent<HTMLElement>) => {
    const { recentBody } = this;
    recentBody.current!.scrollBy(e.deltaY, 0);
  };

  public handleOpenFilter = () => {
    this.setState({ filterIsOpened: true });
  };

  public handleCloseFilter = () => {
    this.setState({ filterIsOpened: false });
  };

  public handleOpenSort = () => {
    this.setState({ sortIsOpened: true });
  };

  public handleCloseSort = () => {
    this.setState({ sortIsOpened: false });
  };

  public handleAgainTransaction = async (username: string, amount: number) => {
    const appStore = this.props.appStore!;
    await appStore.fetchUserListThrottled(username);
    appStore.setCountToSend(amount);
    appStore.setUserToSend(username);
    appStore.setDrawerIsOpened(true);
  };

  public handleSwitchFilter = (index: number) => {
    this.setState({ filter: filterOptions[index] });
    this.handleCloseFilter();
  };

  public handleSwitchSort = (index: number) => {
    this.setState({ sort: sortOptions[index] });
    this.handleCloseSort();
  };

  public handleChangeFilterString = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ filterString: e.currentTarget.value });
  };

  public render() {
    const appStore = this.props.appStore!;
    const { recentBody } = this;
    const { filter, filterIsOpened, sortIsOpened, filterString, sort } = this.state;
    const height = recentBody.current ? window.innerHeight - recentBody.current.offsetTop : '0px';
    //* Фильтрация и сортировка списка транзакций */
    const recentTransactions = appStore.recentTransactions
      .filter(transaction => {
        if (!filterString) return true;
        switch (filter.field) {
          case 'date': {
            return toDate(transaction.date) === toDate(filterString);
          }
          case 'amount': {
            return Math.abs(transaction.amount) === Number(filterString);
          }
          default: {
            return transaction.username.toLowerCase().indexOf(filterString.toLowerCase()) !== -1;
          }
        }
      })
      .sort((t1, t2) => {
        return sortTransactions(t1, t2, sort);
      });
    return (
      <div className="recent-container">
        <div
          className="recent-container__body pretty-scroll"
          ref={recentBody}
          onWheel={this.handleWheelOnBody}
          style={{ height }}
        >
          <div className="recent-container__head">
            <Typography variant={appStore.isMobile ? 'h2' : 'h1'}>Recent transactions</Typography>

            <div className="recent-container__sorts">
              Order by
              <div className="recent-container__filter-choose" ref={this.sortLabel}>
                <Link style={{ cursor: 'pointer' }} onClick={this.handleOpenSort}>{` ${
                  sort.title
                } `}</Link>
              </div>
            </div>
            <div className="recent-container__filters">
              Filter by
              <div className="recent-container__filter-choose" ref={this.filterLabel}>
                <Link style={{ cursor: 'pointer' }} onClick={this.handleOpenFilter}>{` ${
                  filter.title
                } `}</Link>
              </div>
              <Input
                style={{ width: '150px' }}
                onChange={this.handleChangeFilterString}
                type={filter.field === 'date' ? 'date' : 'text'}
              />
              <Menu
                id="sortMenu"
                anchorEl={this.sortLabel!.current}
                open={sortIsOpened}
                onClose={this.handleCloseSort}
              >
                {sortOptions.map((sortItem, index) => {
                  const handleChoose = () => {
                    this.handleSwitchSort(index);
                  };
                  return (
                    <MenuItem key={`sortOptions_${index}`} onClick={handleChoose}>
                      {sortItem.title}
                    </MenuItem>
                  );
                })}
              </Menu>
              <Menu
                id="filterMenu"
                anchorEl={this.filterLabel!.current}
                open={filterIsOpened}
                onClose={this.handleCloseFilter}
              >
                {filterOptions.map((filterItem, index) => {
                  const handleChoose = () => {
                    this.handleSwitchFilter(index);
                  };
                  return (
                    <MenuItem key={`sortOptions_${index}`} onClick={handleChoose}>
                      {filterItem.title}
                    </MenuItem>
                  );
                })}
              </Menu>
            </div>
          </div>
          {recentTransactions.map((transaction, index) => (
            <TransactionCard
              key={`transaction_${transaction.id}`}
              {...transaction}
              handleAgainTransaction={this.handleAgainTransaction}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default RecentContainer;
