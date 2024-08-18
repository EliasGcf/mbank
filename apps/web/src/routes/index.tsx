import { createBrowserRouter, redirect } from 'react-router-dom';

import { NotFound } from '@/routes/404';
import { AuthLayout } from '@/routes/auth/auth.layout';
import { SignInPage } from '@/routes/auth/sign-in.page';
import { SignUpPage } from '@/routes/auth/sign-up.page';
import { ErrorPage } from '@/routes/error.page';
import { AppLayout } from '@/routes/app/app.layout';
import { DashboardPage } from '@/routes/app/dashboard.page';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    id: 'app',
    loader: async ({ request }) => {
      const token = localStorage.getItem('token');

      if (!token) {
        const toAccount = new URL(request.url).searchParams.get('toAccount');
        if (toAccount) localStorage.setItem('toAccount', toAccount);

        return redirect(`/sign-in`);
      }

      return null;
    },
    children: [
      {
        path: '/',
        element: <DashboardPage />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <ErrorPage />,
    loader: async () => {
      const token = localStorage.getItem('token');
      if (token) return redirect('/');
      return null;
    },
    children: [
      {
        path: '/sign-in',
        element: <SignInPage />,
      },
      {
        path: '/sign-up',
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
