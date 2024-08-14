import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AccountQuery } from '@/graphql/querys/__generated__/AccountQuery.graphql';
import { accountQuery } from '@/graphql/querys/AccountQuery';
import { CircleUserIcon } from 'lucide-react';
import { useLazyLoadQuery } from 'react-relay';
import { useNavigate, useRouteLoaderData } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();

  const { accountId } = useRouteLoaderData('app') as { accountId: string };
  const { node } = useLazyLoadQuery<AccountQuery>(accountQuery, { id: accountId });

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('accountId');

    navigate('/sign-in');
  }

  return (
    <div>
      <header className="bg-muted/80 px-6 py-4 flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <CircleUserIcon className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
      <pre>{JSON.stringify(node, null, 2)}</pre>
    </div>
  );
}
