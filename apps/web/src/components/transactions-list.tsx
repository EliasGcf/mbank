import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTransactions } from '@/hooks/transactions.hook';
import { LoaderCircleIcon } from 'lucide-react';
import dayjs from 'dayjs';
import { formatCurrency } from '@/utils/format-currency';
import { useMyAccount } from '@/hooks/my-account.hook';

export function TransactionsList() {
  const data = useTransactions();
  const { account: myAccount } = useMyAccount();

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-3xl font-semibold">Transactions</h2>

      <Table>
        <TableCaption> A list of your recente transactions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Made at</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.account?.transactions?.edges?.map((edge) => {
            const isIncoming = myAccount.id === edge?.node?.toAccount.id;
            const account = isIncoming ? edge?.node?.fromAccount : edge?.node?.toAccount;

            return (
              <TableRow key={edge?.node?.id}>
                <TableCell>{isIncoming ? 'Income' : 'Outcome'}</TableCell>
                <TableCell>{account?.name}</TableCell>
                <TableCell>{edge?.node?.description ?? '-'}</TableCell>
                <TableCell>
                  {dayjs(edge?.node?.createdAt ?? new Date()).format(
                    'HH:mm:ss - DD/MM/YYYY',
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isIncoming ? '+' : '- '}
                  {formatCurrency((edge?.node?.amountInCents ?? 0) / 100)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-3xl font-semibold">Transactions</h2>
      <LoaderCircleIcon className="animate-spin size-5" />
    </div>
  );
}

TransactionsList.Skeleton = Skeleton;
