import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem("username"));
};

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/Register" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
