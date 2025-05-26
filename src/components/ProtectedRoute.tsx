// src/components/ProtectedRoute.tsx

import React from "react";
import { Navigate, useLocation, Location } from "react-router-dom";

// Simple auth check based on localStorage (adjust as needed)
const isAuthenticated = (): boolean => {
  return Boolean(localStorage.getItem("username"));
};

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  // Redirect unauthenticated users to /login,
  // saving current location for redirect after login
  if (!isAuthenticated()) {
    return <Navigate to="/Register" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
}
