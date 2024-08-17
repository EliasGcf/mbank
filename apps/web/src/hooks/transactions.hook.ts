import { TransactionsQuery } from '@/graphql/querys/__generated__/TransactionsQuery.graphql';
import { transactionsQuery } from '@/graphql/querys/Transactions.query';
import { useLazyLoadQuery } from 'react-relay';

export function useTransactions() {
  const data = useLazyLoadQuery<TransactionsQuery>(transactionsQuery, {});

  return data;
}
