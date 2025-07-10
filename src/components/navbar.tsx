import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Bell, UserCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export function Navbar() {
  const { user, logout } = useAuth();
  const { notifications, markAllAsRead, clearNotifications } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const { toast } = useToast();
  const location = useLocation();

  // ✅ Show toast on /dashboard load
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      notifications.filter((n) => !n.read).forEach((n) => {
        toast({
          title: "📢 Notification",
          description: n.message,
          duration: 5000,
        });
      });
      markAllAsRead();
    }
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="mr-6">
          <Logo />
        </Link>

        <nav className="hidden md:flex flex-1 items-center justify-between">
          {/* Left Links */}
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

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* 🔔 Notification Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-xs text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold">Notifications</span>
                  <div className="flex gap-1">
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Mark all as read
                    </button>
                    <button
                      onClick={clearNotifications}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500">No notifications</p>
                  ) : (
                    notifications.map((n,i) => (
                      <li className="p-2 border-b last:border-b-0">
                        {n.message}
                      </li>
                                  
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* 👤 User Info + Auth */}
            <Button variant="ghost" size="icon">
              <UserCircle className="h-5 w-5" />
            </Button>

            {user ? (
              <>
                <span className="text-sm font-medium">{user.name}</span>
                <Button variant="outline" onClick={logout}>
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

        {/* Mobile Right Section */}
        <div className="flex md:hidden flex-1 justify-end">
          <Button variant="outline" size="icon">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
