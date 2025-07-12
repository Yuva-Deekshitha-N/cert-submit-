import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: "admin" | "student";
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Optional debug log
    console.log("🔒 ProtectedRoute: loading =", isLoading, "user =", user);
  }, [isLoading, user]);

  // Wait for AuthContext to finish loading user from localStorage
  if (isLoading) {
    return <div className="p-6 text-center">Loading authentication...</div>;
  }

  // Redirect if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect if user does not have required role
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Access granted
  return <>{children}</>;
};

export default ProtectedRoute;
