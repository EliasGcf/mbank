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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from 'react-relay';

import { LoaderCircleIcon } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoginMutation } from '@/graphql/mutations/__generated__/LoginMutation.graphql';
import { loginMutation } from '@/graphql/mutations/Login.mutation';

const formSchema = z.object({
  email: z
    .string({ required_error: 'Email é obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z.string({ required_error: 'Senha é obrigatória' }),
});

export function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: location.state?.email,
    },
  });

  const [commitMutation, isMutating] = useMutation<LoginMutation>(loginMutation);

  function onSubmit(values: z.infer<typeof formSchema>) {
    commitMutation({
      variables: { data: values },
      onCompleted: (response) => {
        if (response.Login?.token) {
          localStorage.setItem('token', response.Login.token);
          navigate('/');
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Não tem uma conta?{' '}
              <Link to="/sign-up" className="underline">
                Registre-se
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
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
                <FormItem className="grid gap-2">
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              {isMutating ? <LoaderCircleIcon className="animate-spin" /> : 'Login'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
