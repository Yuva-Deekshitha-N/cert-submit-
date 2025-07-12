import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

// ✅ User type
type User = {
  name: string;
  email: string;
  role: string;
  token: string;
};

// ✅ Context type
interface AuthContextType {
  user: User | null;
  login: (tokenOrUser: string | User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isLoading: boolean; // ✅ added for ProtectedRoute
}

// ✅ Default Context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: () => false,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

// ✅ Provider Component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // ✅ tracks loading state

  // ✅ Token Validator
  const validateToken = useCallback((token: string): User => {
    if (!token || token.split(".").length !== 3) {
      throw new Error("Invalid token format");
    }

    const decoded = jwtDecode<{
      name?: string;
      email?: string;
      role?: string;
      exp?: number;
    }>(token);

    if (!decoded.email) {
      throw new Error("Invalid token: missing email");
    }

    return {
      name: decoded.name || "",
      email: decoded.email,
      role: decoded.role || "student",
      token,
    };
  }, []);

  // ✅ Load user from localStorage
  const loadUser = useCallback(() => {
    const token = localStorage.getItem("token");

    if (!token || token === "null" || token === "undefined") {
      setIsLoading(false); // ✅ mark loading done
      return;
    }

    try {
      const validUser = validateToken(token);
      setUser(validUser);
    } catch (err) {
      console.error("❌ Invalid token, clearing storage");
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false); // ✅ done loading regardless of result
    }
  }, [validateToken]);

  // ✅ Run once on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ✅ Login Function
  const login = (tokenOrUser: string | User) => {
    if (typeof tokenOrUser === "string") {
      try {
        const validatedUser = validateToken(tokenOrUser);
        localStorage.setItem("token", tokenOrUser);
        setUser(validatedUser);
      } catch (err) {
        console.error("❌ Token validation failed on login:", err);
      }
    } else {
      localStorage.setItem("token", tokenOrUser.token);
      setUser(tokenOrUser);
    }
  };

  // ✅ Logout Function
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("token");

    // Optional: revoke Google token if Google One-Tap is used
    const token = localStorage.getItem("token");
    if (token && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
        window.google.accounts.id.revoke(token, () => {});
      } catch (error) {
        console.error("❌ Google logout failed:", error);
      }
    }
  }, []);

  // ✅ Auth check
  const isAuthenticated = useCallback(() => {
    if (!user?.token) return false;

    try {
      validateToken(user.token);
      return true;
    } catch {
      return false;
    }
  }, [user, validateToken]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
