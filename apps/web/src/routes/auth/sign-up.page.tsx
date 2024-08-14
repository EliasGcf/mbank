import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useMutation } from 'react-relay';
import { LoaderCircleIcon } from 'lucide-react';
import { createAccountMutation } from "@/graphql/mutations/CreateAccount.mutation";
import { CreateAccountMutation } from "@/graphql/mutations/__generated__/CreateAccountMutation.graphql";

const formSchema = z
  .object({
    name: z.string({ required_error: 'Nome é obrigatório' }),
    email: z
      .string({ required_error: 'Email é obrigatório' })
      .email({ message: 'Email inválido' }),
    password: z.string({ required_error: 'Senha é obrigatória' }),
    passwordConfirmation: z.string({
      required_error: 'Confirmação de senha é obrigatória',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirmation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ['password', 'passwordConfirmation'],
      });
    }
  });



export function SignUpPage() {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [commitMutation, isMutating] = useMutation<CreateAccountMutation>(createAccountMutation);

  function onSubmit(values: z.infer<typeof formSchema>) {
    commitMutation({
      variables: { data: values },
      onCompleted: (response) => {
        if (response.CreateAccount?.account?.id) {
          navigate('/sign-in', { state: { email: values.email } });
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex justify-center">
        <Card className="mx-auto max-w-sm w-full">
          <CardHeader>
            <CardTitle className="text-xl">Cadastro</CardTitle>
            <CardDescription>
              Insira suas informações para criar uma conta
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="João" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="seu-email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmação de senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter className="flex-col">
            <Button type="submit" className="w-full">
              {isMutating ? <LoaderCircleIcon className="animate-spin" /> : 'Criar conta'}
            </Button>

            <div className="mt-4 text-center text-sm">
              Já possui uma conta?{' '}
              <Link to="/sign-in" className="underline">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
