import { useEffect, useState } from "react";
import { Route, Redirect, redirect, Navigate } from "react-router-dom";
import axiosInstance from "../../axios-config";
export default function ProtectedRoute({ children, isAuthenticated }) {
  const [check, setCheck] = useState(false);
  useEffect(() => {
    async function isAuth() {
      const { data } = await axiosInstance.get(`/authUser`);
      return data.status;
      console.log(data.status, isAuthenticated);
    }
    setCheck(isAuthenticated ? true : isAuth());
  }, []);
  return isAuthenticated || check ? children : <Navigate to={"/auth"} />;
}
