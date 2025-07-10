import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { jwtDecode } from "jwt-decode";


// ✅ Define user type (including role)
type User = {
  name: string;
  email: string;
  role: string;
  token?: string;
};

// ✅ Define context type
interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

// ✅ Create the AuthContext with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

// ✅ Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// ✅ Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // ✅ Restore user from localStorage on reload
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ✅ New login function: accepts token and decodes role
  const login = (token: string) => {
    const decoded: any = jwtDecode(token);
    const user = {
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      token,
    };
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  // ✅ Logout clears state and localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("studentEmail");
    localStorage.removeItem("username");

    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
