import "./App.css";
import ChatBox from "./pages/ChatBox/ChatBox";
import ChatsNav from "./pages/ChatsNav/ChatsNav";
import QuickNav from "./pages/QuickNav/QuickNav";
import styles from "./pages/main.module.css";
import { Outlet } from "react-router-dom";
import { useCookies } from "react-cookie";
import jwt from "jwt-decode";
import axiosInstance from "./axios-config.js";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AuthL from "./pages/Auth/AuthL";
import ProtectedRoute from "./pages/ProtectedRoute/ProtectedRoute";
import jwtDecode from "jwt-decode";
import Default from "./pages/Default/Default";
import { SocketProvider } from "./SocketContext.js";
import { getTokenFromCookies } from "./cookieUtil";
function App() {
  const [cookie, setCookie] = useState(getTokenFromCookies());
  const [isAuthenticate, setAuth] = useState(false);
  const [userM, setUserM] = useState({});
  const containerClasses = `${styles.flexDirectionRow} ${styles.makeFlex} ${styles.h100vh} mainContainer`;

  useEffect(() => {
    console.log("Called");
    const verifyCookie = async () => {
      let user = null;
      if (cookie.length == 0) {
        setAuth(false);
        console.log("Auth is false");
      }
      try {
        if (cookie.length > 1) {
          const { data } = await axiosInstance.get(`/authUser`);
          if (data.status === true) {
            setAuth(true);
            const user = await jwtDecode(cookie);
            const res = await axiosInstance.get(`/api/members/${user.id}`);
            setUserM(res.data);
            console.log("Verified");
          } else {
            setAuth(false);
          }
          console.log(data);
        }
      } catch (error) {
        console.log("Set to false");
        console.log(error);
        setAuth(false);
      }
      if (!!user) {
        setAuth(true);
      }
    };
    verifyCookie();
  }, [cookie]);

  return (
    <SocketProvider>
      <Routes>
        <Route
          path="/auth"
          element={
            <AuthL setCookie={setCookie} isAuthenticate={isAuthenticate} />
          }
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
          <Route index element={<Default user={userM} />} />
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
          <Route
            path="*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticate}>
                <div>Not Found! 404</div>
              </ProtectedRoute>
            }
          ></Route>
        </Route>
      </Routes>
    </SocketProvider>
  );
}

export default App;
