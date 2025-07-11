import React, {
  createContext, useState, useEffect,
  ReactNode, useContext, useCallback
} from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  name: string;
  email: string;
  role: string;
  token: string;
  
};

interface AuthContextType {
  user: User | null;
  login: (tokenOrUser: string | User) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isAuthenticated: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const validateToken = useCallback((token: string): User => {
    if (!token || typeof token !== 'string') {
      throw new Error('Token must be a string');
    }

    const decoded = jwtDecode<{
      name?: string;
      email: string;
      role: string;
      exp: number;
    }>(token);

    if (!decoded.email || !decoded.role) {
      throw new Error('Invalid token: Missing required fields');
    }

    return {
      name: decoded.name || '',
      email: decoded.email,
      role: decoded.role,
      token,
      
    };
  }, []);

  const loadUser = useCallback(() => {
    const token = localStorage.getItem('token');

    if (!token || typeof token !== 'string') {
      console.warn('🔒 No token found or invalid format in localStorage');
      return;
    }

    try {
      const validatedUser = validateToken(token);
      setUser(validatedUser);
    } catch (error) {
      console.error('❌ Failed to load user:', error);
      localStorage.removeItem('token');
    }
  }, [validateToken]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = (tokenOrUser: string | User) => {
  if (typeof tokenOrUser === "string") {
    const decoded: any = jwtDecode(tokenOrUser);
    const user = {
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      token: tokenOrUser,
    };
    setUser(user);
    localStorage.setItem("token", tokenOrUser);
  } else {
    setUser(tokenOrUser); // This is a user object (from Google login)
    localStorage.setItem("token", tokenOrUser.token); // Save dummy token
  }
};

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');

    const storedToken = localStorage.getItem('token');
    if (storedToken && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
        window.google.accounts.id.revoke(storedToken, () => {});
      } catch (error) {
        console.error('❌ Google logout error:', error);
      }
    }
  }, []);

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
