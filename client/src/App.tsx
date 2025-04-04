import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import Header from "@components/header/header";
import Login from "./components/pages/login";
import Register from "./components/pages/register";
import useInitAuthState from "./utils/is-auth";
import { getNameOrEmail } from "@utils/manage-nickname";

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
        element: <h2>Main page {getNameOrEmail()}</h2>,
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

const App = () => {
  useInitAuthState();
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default App;
