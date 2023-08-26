import "./App.css";
import ChatBox from "./pages/ChatBox/ChatBox";
import ChatsNav from "./pages/ChatsNav/ChatsNav";
import QuickNav from "./pages/QuickNav/QuickNav";
import styles from "./pages/main.module.css";
import {
  createBrowserRouter,
  BrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import { useCookies } from "react-cookie";
import jwt from "jwt-decode";
import axiosInstance from "./axios-config.js";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthL from "./pages/Auth/AuthL";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import jwtDecode from "jwt-decode";
import axios from "axios";

function App() {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [isAuthenticate, setAuth] = useState(!!cookies);
  const [userM, setUserM] = useState({});
  const containerClasses = `${styles.flexDirectionRow} ${styles.makeFlex} ${styles.h100vh} mainContainer`;
  useEffect(() => {
    const verifyCookie = async () => {
      console.log(cookies);
      let user = null;
      if (!cookies.token) {
        setAuth(false);
        localStorage.removeItem("user");
      }
      try {
        if ("token" in cookies) {
          const { data } = await axiosInstance.get(`/authUser`);
          if (data.status === true) {
            setAuth(true);
            const user = await jwtDecode(cookies.token);
            console.log(user);
            const res = await axiosInstance.get(`/api/members/${user.id}`);
            setUserM(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
          } else {
            setAuth(false);
          }
          console.log(data);
        }
      } catch (error) {
        setAuth(false);
      }

      if (!!user) {
        setAuth(true);
      }
    };
    verifyCookie();
  }, []);

  return (
    <Routes>
      <Route
        path="/auth"
        element={<AuthL isAuthenticate={isAuthenticate} />}
      ></Route>
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticate}>
            <div className={containerClasses}>
              <QuickNav user={userM} />
              <Outlet user={userM} />
            </div>
          </ProtectedRoute>
        }
      >
        <Route
          path="server/:id"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticate}>
              <ChatsNav user={userM} />
              <Outlet user={userM} />
            </ProtectedRoute>
          }
        >
          <Route
            path="channels/:cId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticate}>
                <ChatBox user={userM} />
              </ProtectedRoute>
            }
          />
          <Route
            path=":uId"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticate}>
                <ChatBox user={userM} />
              </ProtectedRoute>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
