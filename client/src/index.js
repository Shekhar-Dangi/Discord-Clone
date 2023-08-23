import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import ChatsNav from "./pages/ChatsNav/ChatsNav";
import ChatBox from "./pages/ChatBox/ChatBox";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "server/:id",
        element: (
          <>
            <ChatsNav />
            <Outlet />
          </>
        ),
        children: [
          {
            path: "channels/:cId",
            element: <ChatBox />,
          },
          {
            path: ":uId",
            element: <ChatBox />,
          },
        ],
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
