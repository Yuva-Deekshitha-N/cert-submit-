import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please fill in both username and password.");
      return;
    }

    // Save username in localStorage to simulate login
    localStorage.setItem("username", username);

    // Redirect to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col w-80 space-y-4 p-6 border rounded shadow bg-white">
        <h2 className="text-xl font-bold text-center">Sign In</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border p-2 rounded"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          className="bg-maroon-700 text-white py-2 rounded hover:bg-maroon-900"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
