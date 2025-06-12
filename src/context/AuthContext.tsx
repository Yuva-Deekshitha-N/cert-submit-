import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

// Define user type
type User = {
  name: string;
  email: string;
  picture: string;
};

// Define context type
interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Create the AuthContext with default values
export const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

// ✅ Custom hook to use the context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));

  // ✅ Add these two lines to persist email and name
  localStorage.setItem("studentEmail", userData.email);
  localStorage.setItem("username", userData.name);
};


  const logout = () => {
  setUser(null);
  localStorage.removeItem("user");
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
