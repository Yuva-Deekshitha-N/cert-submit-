import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Bell, UserCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function Navbar() {
  const [username, setUsername] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Sync username and notifications
  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setNotifications(JSON.parse(localStorage.getItem("notifications") || "[]"));
  }, []);

  // Show dashboard notification on navigation
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      const dashboardNotifs = JSON.parse(localStorage.getItem("dashboard-status") || "[]");
      dashboardNotifs.forEach((msg: string) => {
        toast({
          title: "📢 Status Update",
          description: msg,
          duration: 5000,
        });
      });
    }
  }, [location.pathname, toast]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("studentEmail");
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
            {/* 🔔 Notifications */}
            <div className="relative" ref={dropdownRef}>
              <Button variant="ghost" size="icon" onClick={() => setShowDropdown((prev) => !prev)}>
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-maroon-600 text-xs text-white flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded-md z-50">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 p-4">No notifications</p>
                  ) : (
                    <ul className="text-sm p-2 max-h-64 overflow-auto">
                      {notifications.slice(0, 10).map((msg, i) => (
                        <li key={i} className="p-2 border-b last:border-b-0">{msg}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

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
                <Link to="/register">Sign In</Link>
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
