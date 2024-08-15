import { MyAccountQuery } from '@/graphql/querys/__generated__/MyAccountQuery.graphql';
import { myAccountQuery } from '@/graphql/querys/MyAccount.query';
import { formatCurrency } from '@/utils/format-currency';
import { useLazyLoadQuery } from 'react-relay';

export function useMyAccount() {
  const data = useLazyLoadQuery<MyAccountQuery>(myAccountQuery, {});

  const balance = (data.account?.amountInCents ?? 0) / 100;
  const balanceFormatted = formatCurrency(balance);

  return {
    ...data,
    account: {
      ...data.account,
      balance,
      balanceFormatted,
    },
  };
}
