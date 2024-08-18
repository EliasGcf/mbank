import { Button } from '@/components/ui/button';
import { DialogHeader, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { PropsWithChildren, useEffect, useState } from 'react';
import { useMyAccount } from '@/hooks/my-account.hook';
import { CurrencyInput } from '@/components/currency-input';

import { fetchQuery, useMutation, useRelayEnvironment } from 'react-relay';
import {
  AccountQuery,
  AccountQuery$data,
} from '@/graphql/querys/__generated__/AccountQuery.graphql';
import { accountQuery } from '@/graphql/querys/Account.query';
import { transferMutation } from '@/graphql/mutations/Transfer.mutation';
import { TransferMutation } from '@/graphql/mutations/__generated__/TransferMutation.graphql';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router-dom';

function getFormSchema(maxAmount: number, currentEmail?: string) {
  return z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .email()
      .refine((value) => currentEmail && value !== currentEmail, {
        message: 'You cannot transfer to yourself',
      }),
    amountToTransfer: z
      .number({
        required_error: 'Amount is required',
        invalid_type_error: 'Amount is required',
      })
      .max(maxAmount, { message: 'Amount is greater than the available balance' })
      .refine((value) => value > 0, { message: 'Amount must be greater than 0' }),
  });
}

type FormData = z.infer<ReturnType<typeof getFormSchema>>;

export function TransferDialog(props: PropsWithChildren) {
  const environment = useRelayEnvironment();
  const [searchParams, setSearchParams] = useSearchParams();
  const { account } = useMyAccount();

  const toAccountEmail =
    searchParams.get('toAccount') || localStorage.getItem('toAccount');

  useEffect(() => {
    localStorage.removeItem('toAccount');
    searchParams.delete('toAccount');
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const form = useForm<FormData>({
    resolver: zodResolver(getFormSchema(account.balance, account.email)),
    mode: 'onChange',
    defaultValues: { email: toAccountEmail || '' },
  });

  const [open, setOpen] = useState(() => {
    return !!toAccountEmail;
  });

  const [isLoadingAccountToTransfer, setIsLoadingAccountToTransfer] = useState(false);
  const [accountToTransfer, setAccountToTransfer] = useState<
    AccountQuery$data['account'] | null
  >(null);

  const [transfer, isTransferring] = useMutation<TransferMutation>(transferMutation);

  async function handleTransfer(data: FormData) {
    if (!accountToTransfer) {
      await handleSearchAccount();
      return;
    }

    let idempotenceKey = sessionStorage.getItem('idempotenceKey');

    if (!idempotenceKey) {
      idempotenceKey = Math.random().toString(36).substring(7);
      sessionStorage.setItem('idempotenceKey', idempotenceKey);
    }

    transfer({
      variables: {
        data: {
          amountInCents: data.amountToTransfer * 100,
          toAccountId: accountToTransfer.id,
          idempotenceKey,
        },
      },
      onCompleted: (_, error) => {
        if (!error) handleDialogOpenChange(false);
      },
      onError() {
        form.setError('root.server', {
          type: 'server',
          message: 'A error occurred. Try again later',
        });
      },
    });
  }

  async function handleSearchAccount() {
    const isEmailValid = await form.trigger('email', { shouldFocus: true });

    if (!isEmailValid) return;

    const emailToTransfer = form.getValues('email');

    fetchQuery<AccountQuery>(environment, accountQuery, {
      email: emailToTransfer,
    }).subscribe({
      next: (data) => {
        setAccountToTransfer(data.account);
        setIsLoadingAccountToTransfer(false);
      },
      start: () => {
        setIsLoadingAccountToTransfer(true);
        setAccountToTransfer(null);
      },
      error: (error) => {
        setIsLoadingAccountToTransfer(false);
        setAccountToTransfer(null);

        if (error instanceof Error) {
          form.setError('email', { message: error.message });
        }
      },
    });
  }

  function handleDialogOpenChange(open: boolean) {
    if (isTransferring) return;

    setOpen(open);

    const isClosing = open === false;

    if (isClosing) {
      form.reset();
      form.clearErrors();
      setAccountToTransfer(null);
      sessionStorage.removeItem('idempotenceKey');
    }
  }

  return (
    <Dialog onOpenChange={handleDialogOpenChange} open={open}>
      {props.children}

      <Form {...form}>
        <DialogContent>
          <form
            onSubmit={form.handleSubmit(handleTransfer)}
            className="flex flex-col gap-4"
          >
            <DialogHeader>
              <DialogTitle>What is the transfer amount?</DialogTitle>
            </DialogHeader>

            <DialogDescription>
              Available balance of <strong>{account?.balanceFormatted}</strong>
            </DialogDescription>

            <FormField
              control={form.control}
              name="amountToTransfer"
              render={({ field }) => (
                <FormItem className="flex flex-col flex-1">
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <CurrencyInput
                      intlConfig={{ locale: 'pt-BR', currency: 'BRL' }}
                      onValueChange={(_, __, values) => field.onChange(values?.float)}
                      onBlur={field.onBlur}
                      name={field.name}
                      placeholder="R$ 0,00"
                      prefix="R$"
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Destination e-mail</FormLabel>
                  <div className="flex gap-2 items-end">
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="seu-email@example.com"
                        className="flex-1"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          setAccountToTransfer(null);
                        }}
                      />
                    </FormControl>
                    <Button
                      variant="outline"
                      size="icon"
                      type="button"
                      onClick={handleSearchAccount}
                    >
                      {isLoadingAccountToTransfer ? (
                        <LoaderCircleIcon className="animate-spin size-4" />
                      ) : (
                        <SearchIcon className="size-4" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {accountToTransfer && (
              <div>
                <div>
                  <strong>Name: </strong>
                  <span>{accountToTransfer.name}</span>
                </div>

                <div>
                  <strong>E-mail: </strong>
                  <span>{accountToTransfer.email}</span>
                </div>
              </div>
            )}

            <DialogFooter className="flex items-center gap-2">
              <span className="text-destructive text-sm">
                {form.formState.errors.root?.server.message}
              </span>
              <Button variant="outline" size="sm" disabled={isTransferring} type="submit">
                {isTransferring ? (
                  <>
                    Transferring
                    <LoaderCircleIcon className="animate-spin size-4 ml-2" />
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
}
