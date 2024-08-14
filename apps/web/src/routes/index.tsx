import { createBrowserRouter, redirect } from "react-router-dom";

import { NotFound } from "@/routes/404";
import { AuthLayout } from "@/routes/auth/auth.layout";
import { SignInPage } from "@/routes/auth/sign-in.page";
import { SignUpPage } from "@/routes/auth/sign-up.page";

export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    loader: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return redirect("/");
      }
    },
    children: [
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/sign-up",
        element: <SignUpPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
