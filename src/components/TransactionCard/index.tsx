import React, { memo } from 'react';
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

interface ITransactionCardProps extends ITransactionItem {
  handleAgainTransaction: (username: string, amount: number) => void;
}

const TransactionCard = (props: ITransactionCardProps) => {
  const { username, balance, amount, date, handleAgainTransaction } = props;
  const transType = amount > 0 ? 'Incoming' : 'Outcoming';
  const absAmount = Math.abs(amount);
  const handleAgain = () => {
    handleAgainTransaction(username, amount);
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
              {dayjs(date)
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
            <TableCell style={{ overflow: 'hidden' }}>{username}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Balance</TableCell>
            <TableCell>{balance}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
};

const WrappedTransactionCard = memo(TransactionCard);

export default WrappedTransactionCard;
