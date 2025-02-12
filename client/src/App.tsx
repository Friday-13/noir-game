import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import Header from "@components/header/header";
import Login from "./components/pages/login";
import Register from "./components/pages/register";
import { useEffect } from "react";
import { ApiProvider } from "@reduxjs/toolkit/query/react";
import ServerApi from "./utils/server-api";
import { useAppDispatch } from "./store/hooks";
import isAuth from "./utils/is-auth";
import { login } from "./store/auth-slice";
import useInitAuthState from "./utils/is-auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    // errorElement: <ErrorPage />,
    // loader: rootLoader,
    // action: rootAction,
    children: [
      {
        path: "",
        element: <h2>Main page</h2>,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "game",
        element: <h2>Game Page</h2>,
      },
    ],
  },
]);

function App() {
  useInitAuthState();
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
