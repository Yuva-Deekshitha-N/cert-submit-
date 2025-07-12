import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: "admin" | "student";
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // wait until token is validated and user is loaded
    const timeout = setTimeout(() => setLoading(false), 100); // add small delay
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  if (!isAuthenticated()) {
    return (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
