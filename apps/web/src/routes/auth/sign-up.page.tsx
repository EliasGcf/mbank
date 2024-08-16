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
import { createAccountMutation } from '@/graphql/mutations/CreateAccount.mutation';
import { CreateAccountMutation } from '@/graphql/mutations/__generated__/CreateAccountMutation.graphql';

const formSchema = z
  .object({
    name: z.string({ required_error: 'Name is required' }),
    email: z
      .string({ required_error: 'Email is required' })
      .email({ message: 'Invalid email' }),
    password: z.string({ required_error: 'Password is required' }),
    passwordConfirmation: z.string({
      required_error: 'Password confirmation is required',
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

  const [commitMutation, isMutating] =
    useMutation<CreateAccountMutation>(createAccountMutation);

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
            <CardTitle className="text-xl">Sign Up</CardTitle>
            <CardDescription>Enter your information to create an account</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
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
                    <Input placeholder="your-email@example.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
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
                  <FormLabel>Password Confirmation</FormLabel>
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
              {isMutating ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                'Create Account'
              )}
            </Button>

            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link to="/sign-in" className="underline">
                Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
