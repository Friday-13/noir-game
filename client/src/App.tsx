import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import Header from "@components/header/header";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <main>
        <Header isCollapsible={false} />
        <h2>main page</h2>
        <Outlet />
      </main>
    ),
    // errorElement: <ErrorPage />,
    // loader: rootLoader,
    // action: rootAction,
    children: [
      {
        path: "contacts/:contactId",
        // element: <Contact />,
      },
      {
        path: "login",
        element: <h2>Login Page</h2>,
      },
      {
        path: "register",
        element: <h2>register Page</h2>,
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
