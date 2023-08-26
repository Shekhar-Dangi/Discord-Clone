import { Route, Redirect, redirect, Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, isAuthenticated }) {
  return isAuthenticated ? children : <Navigate to={"/auth"} />;
}