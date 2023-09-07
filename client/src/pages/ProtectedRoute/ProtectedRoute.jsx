import { useEffect, useState } from "react";
import { Route, Redirect, redirect, Navigate } from "react-router-dom";
import axiosInstance from "../../axios-config";
export default function ProtectedRoute({ children, isAuthenticated }) {
  const [check, setCheck] = useState(false);
  useEffect(() => {
    async function isAuth() {
      const { data } = await axiosInstance.get(`/authUser`);
      console.log(data.status, isAuthenticated);
      return data.status;
    }
    setCheck(isAuthenticated ? true : isAuth());
  }, []);
  return isAuthenticated || check ? children : <Navigate to={"/auth"} />;
}
