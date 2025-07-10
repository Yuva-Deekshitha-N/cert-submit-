import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback } from "react";
import { jwtDecode } from "jwt-decode";

type User = {
  name: string;
  email: string;
  role: string;
  token: string;
  exp?: number;
};

interface AuthContextType {
  user: User | null;
  login: (token: string) => Promise<void>;
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
    if (typeof token !== 'string') {
      throw new Error('Token must be a string');
    }

    const decoded = jwtDecode<{
      name: string;
      email: string;
      role: string;
      exp: number;
    }>(token);

    if (!decoded.email || !decoded.role) {
      throw new Error('Invalid token: Missing required fields');
    }

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      throw new Error('Token expired');
    }

    return {
      name: decoded.name || '',
      email: decoded.email,
      role: decoded.role,
      token,
      exp: decoded.exp,
    };
  }, []);

  const loadUser = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const validatedUser = validateToken(token);
      setUser(validatedUser);
    } catch (error) {
      console.error('Failed to load user:', error);
      localStorage.removeItem('token');
    }
  }, [validateToken]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (token: string) => {
    try {
      const validatedUser = validateToken(token);
      setUser(validatedUser);
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, [validateToken]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('token');
    
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
        window.google.accounts.id.revoke(localStorage.getItem('token') || '', () => {});
      } catch (error) {
        console.error('Google logout error:', error);
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