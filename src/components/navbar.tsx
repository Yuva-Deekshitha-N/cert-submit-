import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Bell, UserCircle } from "lucide-react";

export function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("username");
    setUsername(user);

    // Listen to storage changes (optional)
    function onStorageChange() {
      setUsername(localStorage.getItem("username"));
    }
    window.addEventListener("storage", onStorageChange);
    return () => window.removeEventListener("storage", onStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-6">
          <Logo />
        </Link>
        <nav className="hidden md:flex flex-1 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-maroon-700">
              Dashboard
            </Link>
            <Link to="/certificates" className="text-sm font-medium transition-colors hover:text-maroon-700">
              Certificates
            </Link>
            <Link to="/locations" className="text-sm font-medium transition-colors hover:text-maroon-700">
              Locations
            </Link>
            <Link to="/chatbot" className="text-sm font-medium transition-colors hover:text-maroon-700">
              Help
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-maroon-600 text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
            <Button variant="ghost" size="icon">
              <UserCircle className="h-5 w-5" />
            </Button>

            {username ? (
              <>
                <span className="text-sm font-medium">{username}</span>
                <Button variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </nav>
        <div className="flex md:hidden flex-1 justify-end">
          <Button variant="outline" size="icon">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
