import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import Header from "@components/header/header";
import Login from "./components/pages/login";

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
        element: <Login />
      },
      {
        path: "register",
        element: <h2>Register Page</h2>,
      },
      {
        path: "game",
        element: <h2>Game Page</h2>,
      },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
