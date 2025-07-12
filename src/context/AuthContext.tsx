import React, {
  createContext, useState, useEffect,
  ReactNode, useContext, useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";

// User type
type User = {
  name: string;
  email: string;
  role: string;
  token: string;
};

// Context type
interface AuthContextType {
  user: User | null;
  login: (tokenOrUser: string | User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

// Default context
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: () => false,
});

export const useAuth = () => useContext(AuthContext);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Token decoder and validator
  const validateToken = useCallback((token: string): User => {
  console.log("🔍 Validating token:", token); // Add this line
    if (!token || token.split(".").length !== 3) {
      throw new Error("Token format invalid");
    }

    const decoded = jwtDecode<{
      name?: string;
      email?: string;
      role?: string;
      exp?: number;
    }>(token);

    if (!decoded.email) {
      throw new Error("Invalid token: Missing email");
    }

    const role = decoded.role || "student"; // Fallback for Google token

    return {
      name: decoded.name || "",
      email: decoded.email,
      role,
      token,
    };
  }, []);

  // Load user from localStorage
  const loadUser = useCallback(() => {
  const token = localStorage.getItem("token");

  if (!token || token === "null" || token === "undefined") {
    console.warn("🔒 No valid token in localStorage");
    return;
  }

  try {
    const validatedUser = validateToken(token);
    setUser(validatedUser);
  } catch (error) {
    console.error("❌ Failed to load user:", error);
    localStorage.removeItem("token");
  }
}, [validateToken]);


  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Login with token or user object
  const login = (tokenOrUser: string | User) => {
  if (typeof tokenOrUser === "string") {
    const decoded: any = jwtDecode(tokenOrUser);
    const user = {
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      token: tokenOrUser,
    };
    console.log("🧪 Attempting to save token:", tokenOrUser);
    setTimeout(() => {
      console.log("🔍 Token in localStorage (after delay):", localStorage.getItem("token"));
    }, 1000);

    setUser(user);
    localStorage.setItem("token", tokenOrUser); // ✅ THIS LINE
  } else {
    setUser(tokenOrUser);
    localStorage.setItem("token", tokenOrUser.token);
  }
};

  // Logout
  const logout = useCallback(() => {
  setUser(null);
  localStorage.removeItem("token"); // ✅ removes token on logout

  // Optional: Revoke Google login if using Google One-Tap
  const storedToken = localStorage.getItem("token");
  if (storedToken && window.google?.accounts?.id) {
    try {
      window.google.accounts.id.disableAutoSelect();
      window.google.accounts.id.revoke(storedToken, () => {});
    } catch (error) {
      console.error("❌ Google logout error:", error);
    }
  }
}, []);


  // Auth check
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
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
