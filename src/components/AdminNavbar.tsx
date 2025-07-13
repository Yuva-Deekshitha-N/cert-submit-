// src/components/AdminNavbar.tsx
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-red-700 text-white px-6 py-4 shadow flex justify-between items-center">
      <h1 className="text-xl font-bold">Admin Dashboard</h1>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="text-sm">{user.name}</span>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="bg-white text-red-700 px-3 py-1 rounded hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default AdminNavbar;
