
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "@/utils/auth";

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
