import React from 'react';
import { ITransactionItem } from '../../module';
import './TransactionCard.scss';
import {
  Paper,
  Typography,
  Divider,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Link,
} from '@material-ui/core';
import dayjs from 'dayjs';
import 'dayjs/locale/en'; // load on demand
import { inject, observer } from 'mobx-react';

interface ITransactionCardProps extends ITransactionItem {
  handleAgainTransaction: (username: string, amount: number) => void;
}

const TransactionCard = (props: ITransactionCardProps) => {
  const transType = props.amount > 0 ? 'Incoming' : 'Outcoming';
  const absAmount = Math.abs(props.amount);
  const handleAgain = () => {
    props.handleAgainTransaction(props.username, props.amount);
  };
  return (
    <Paper className="transaction-card">
      <div className="transaction-card__head">
        <Typography variant="h2">{transType}</Typography>
        <Link style={{ cursor: 'pointer' }} onClick={handleAgain}>
          again
        </Link>
      </div>

      <Divider />
      <Table style={{ tableLayout: 'fixed' }}>
        <TableBody>
          <TableRow>
            <TableCell style={{ width: '10px' }}>Date:</TableCell>
            <TableCell>
              {dayjs(props.date)
                .locale('en')
                .format('DD.MM.YY HH:mm')}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>{absAmount}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{transType === 'Incoming' ? 'Sender' : 'Recipient'}</TableCell>
            <TableCell style={{ overflow: 'hidden' }}>{props.username}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Balance</TableCell>
            <TableCell>{props.balance}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

const WrappedTransactionCard = inject('appStore')(observer(TransactionCard));

export default WrappedTransactionCard;
