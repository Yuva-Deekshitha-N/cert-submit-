// src/context/NotificationContext.tsx
import {
  createContext,
  useContext,
  useState,
  useRef, 
  ReactNode,
  useEffect,
} from "react";

// 🔹 Type for a notification
type Notification = {
  id: number;
  message: string;
  type: "info" | "warning" | "success" | "error";
  read: boolean;
};

// 🔹 Context type
type NotificationContextType = {
  notifications: Notification[];
  addNotification: (message: string, type?: Notification["type"]) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
};

// 🔹 Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// 🔹 Provider component
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // ⏱ Restore from localStorage on load
  useEffect(() => {
    const saved = localStorage.getItem("notifications");
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch {
        setNotifications([]);
      }
    }
  }, []);

  // 💾 Save to localStorage on change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/sounds/notify.mp3.ogg"); // use correct path
  }, []);

  // ✅ Add notification
  const addNotification = (message: string, type: Notification["type"] = "info") => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      type,
      read: false,
    };
    setNotifications((prev) => [...prev, newNotification]);
    
    if (audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch((err) => {
      console.warn("Notification sound failed:", err);
    });
  }
  

  };

  // ✅ Mark all as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // ✅ Clear all
  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, addNotification, markAllAsRead, clearNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// 🔹 Hook to use in any component
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error("useNotifications must be used within NotificationProvider");
  return context;
};
